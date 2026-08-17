# Décompression partagée des entrées d'un .pack TWW3.
#
# Deux compressions coexistent dans les packs workshop :
#   - zstd, la plus courante, déléguée à libzstd.dll (livrée avec Git for Windows)
#   - LZ4, utilisée par certains gros mods (ex. DEER24Cathay.pack), décodée ici
#
# Dans les deux cas la charge utile d'une entrée compressée commence par 4 octets
# donnant la taille décompressée, suivis du flux. On reconnaît LZ4 à son nombre
# magique 04 22 4D 18 en tête de flux ; tout le reste est traité comme du zstd.
#
# À dot-sourcer depuis un outil :  . "$PSScriptRoot\_unpack.ps1"
# puis :                           $data = Expand-PackEntry $raw $entry.Comp

$env:PATH = "C:\Program Files\Git\mingw64\bin;" + $env:PATH

if(-not ("Zstd" -as [type])){ Add-Type -TypeDefinition @"
using System; using System.Runtime.InteropServices;
public static class Zstd { [DllImport("libzstd.dll", CallingConvention=CallingConvention.Cdecl)] public static extern ulong ZSTD_decompress(byte[] dst, ulong dstCapacity, byte[] src, ulong srcSize); }
"@ }

if(-not ("Lz4" -as [type])){ Add-Type -TypeDefinition @"
using System;

public static class Lz4 {

    // Décode un bloc LZ4 brut. Le format alterne littéraux et références arrière :
    // un token (4 bits de longueur de littéraux, 4 bits de longueur de match),
    // les littéraux, un offset sur 2 octets, puis la longueur du match.
    static int DecodeBlock(byte[] src, int sOff, int sLen, byte[] dst, int dOff) {
        int ip = sOff, iend = sOff + sLen, op = dOff;
        while (ip < iend) {
            int token = src[ip++];
            int litLen = token >> 4;
            if (litLen == 15) { int s; do { s = src[ip++]; litLen += s; } while (s == 255); }
            if (litLen > 0) { Buffer.BlockCopy(src, ip, dst, op, litLen); ip += litLen; op += litLen; }
            if (ip >= iend) break;                       // dernière séquence : littéraux seuls
            int offset = src[ip] | (src[ip + 1] << 8); ip += 2;
            int matchLen = token & 0x0F;
            if (matchLen == 15) { int s; do { s = src[ip++]; matchLen += s; } while (s == 255); }
            matchLen += 4;                               // longueur minimale d'un match
            int m = op - offset;
            // copie octet par octet : les zones peuvent se chevaucher (motifs répétés)
            for (int i = 0; i < matchLen; i++) dst[op++] = dst[m++];
        }
        return op - dOff;
    }

    // Décode un flux au format LZ4 Frame. 'expected' est la taille décompressée
    // annoncée par l'entrée du pack ; elle dimensionne le tampon de sortie.
    public static byte[] DecompressFrame(byte[] src, int expected) {
        int p = 0;
        uint magic = BitConverter.ToUInt32(src, p); p += 4;
        if (magic != 0x184D2204) throw new Exception("flux LZ4 attendu, magic=0x" + magic.ToString("X8"));

        byte flg = src[p++];
        p++;                                             // BD : taille max de bloc, inutile ici
        bool blockChecksum   = (flg & 0x10) != 0;
        bool contentSize     = (flg & 0x08) != 0;
        bool contentChecksum = (flg & 0x04) != 0;
        bool dictId          = (flg & 0x01) != 0;
        if (contentSize) p += 8;
        if (dictId) p += 4;
        p++;                                             // somme de contrôle d'en-tête

        byte[] dst = new byte[expected];
        int op = 0;
        while (p + 4 <= src.Length) {
            uint bs = BitConverter.ToUInt32(src, p); p += 4;
            if (bs == 0) break;                          // marque de fin
            bool stored = (bs & 0x80000000u) != 0;       // bloc stocké tel quel
            int size = (int)(bs & 0x7FFFFFFFu);
            if (stored) { Buffer.BlockCopy(src, p, dst, op, size); op += size; }
            else { op += DecodeBlock(src, p, size, dst, op); }
            p += size;
            if (blockChecksum) p += 4;
        }
        if (contentChecksum) { /* 4 octets de contrôle en fin de flux, non vérifiés */ }
        return dst;
    }
}
"@ }

function Expand-PackEntry {
    param([byte[]]$Raw, [int]$Comp)
    if($Comp -ne 1 -or $Raw.Length -lt 8){ return $Raw }
    $u = [BitConverter]::ToUInt32($Raw, 0)
    $sb = New-Object byte[] ($Raw.Length - 4)
    [Array]::Copy($Raw, 4, $sb, 0, $Raw.Length - 4)
    if($sb[0] -eq 0x04 -and $sb[1] -eq 0x22 -and $sb[2] -eq 0x4D -and $sb[3] -eq 0x18){
        try { return [Lz4]::DecompressFrame($sb, [int]$u) } catch { return $Raw }
    }
    $dst = New-Object byte[] $u
    $null = [Zstd]::ZSTD_decompress($dst, [uint64]$u, $sb, [uint64]$sb.Length)
    return $dst
}
