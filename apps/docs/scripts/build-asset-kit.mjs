import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateRawSync } from 'node:zlib';

const here = path.dirname(fileURLToPath(import.meta.url));
const publicBrand = path.resolve(here, '..', 'public', 'brand');
const out = path.join(publicBrand, 'asset-kit.zip');
const marks = ['fcc-primary.svg', 'fcc-secondary.svg', 'fcc-puck.svg'];

const SIGNATURE_LOCAL_FILE = 0x04034b50;
const SIGNATURE_CENTRAL_DIRECTORY = 0x02014b50;
const SIGNATURE_END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const VERSION_DEFLATE = 20;
const METHOD_DEFLATE = 8;
const LOCAL_FILE_HEADER_BYTES = 30;
const CENTRAL_DIRECTORY_HEADER_BYTES = 46;
const END_OF_CENTRAL_DIRECTORY_BYTES = 22;
const REPRODUCIBLE_DOS_TIME = 0;
const REPRODUCIBLE_DOS_DATE = 0x0021;

function localFileHeader({ crc, deflatedSize, size, nameLength }) {
  const buf = Buffer.alloc(LOCAL_FILE_HEADER_BYTES);
  buf.writeUInt32LE(SIGNATURE_LOCAL_FILE, 0);
  buf.writeUInt16LE(VERSION_DEFLATE, 4);
  buf.writeUInt16LE(0, 6);
  buf.writeUInt16LE(METHOD_DEFLATE, 8);
  buf.writeUInt16LE(REPRODUCIBLE_DOS_TIME, 10);
  buf.writeUInt16LE(REPRODUCIBLE_DOS_DATE, 12);
  buf.writeUInt32LE(crc, 14);
  buf.writeUInt32LE(deflatedSize, 18);
  buf.writeUInt32LE(size, 22);
  buf.writeUInt16LE(nameLength, 26);
  buf.writeUInt16LE(0, 28);
  return buf;
}

function centralDirectoryHeader({
  crc,
  deflatedSize,
  size,
  nameLength,
  localHeaderOffset
}) {
  const buf = Buffer.alloc(CENTRAL_DIRECTORY_HEADER_BYTES);
  buf.writeUInt32LE(SIGNATURE_CENTRAL_DIRECTORY, 0);
  buf.writeUInt16LE(VERSION_DEFLATE, 4);
  buf.writeUInt16LE(VERSION_DEFLATE, 6);
  buf.writeUInt16LE(0, 8);
  buf.writeUInt16LE(METHOD_DEFLATE, 10);
  buf.writeUInt16LE(REPRODUCIBLE_DOS_TIME, 12);
  buf.writeUInt16LE(REPRODUCIBLE_DOS_DATE, 14);
  buf.writeUInt32LE(crc, 16);
  buf.writeUInt32LE(deflatedSize, 20);
  buf.writeUInt32LE(size, 24);
  buf.writeUInt16LE(nameLength, 28);
  buf.writeUInt16LE(0, 30);
  buf.writeUInt16LE(0, 32);
  buf.writeUInt16LE(0, 34);
  buf.writeUInt16LE(0, 36);
  buf.writeUInt32LE(0, 38);
  buf.writeUInt32LE(localHeaderOffset, 42);
  return buf;
}

function endOfCentralDirectory({ entryCount, directorySize, directoryOffset }) {
  const buf = Buffer.alloc(END_OF_CENTRAL_DIRECTORY_BYTES);
  buf.writeUInt32LE(SIGNATURE_END_OF_CENTRAL_DIRECTORY, 0);
  buf.writeUInt16LE(0, 4);
  buf.writeUInt16LE(0, 6);
  buf.writeUInt16LE(entryCount, 8);
  buf.writeUInt16LE(entryCount, 10);
  buf.writeUInt32LE(directorySize, 12);
  buf.writeUInt32LE(directoryOffset, 16);
  buf.writeUInt16LE(0, 20);
  return buf;
}

export function zipDeflatedFlat(files) {
  const localParts = [];
  const centralParts = [];
  let localHeaderOffset = 0;

  for (const { name, body } of files) {
    const nameBuf = Buffer.from(name, 'utf8');
    const deflated = deflateRawSync(body, { level: 9 });
    const entry = {
      crc: crc32(body),
      deflatedSize: deflated.length,
      size: body.length,
      nameLength: nameBuf.length
    };

    localParts.push(localFileHeader(entry), nameBuf, deflated);
    centralParts.push(
      centralDirectoryHeader({ ...entry, localHeaderOffset }),
      nameBuf
    );
    localHeaderOffset +=
      LOCAL_FILE_HEADER_BYTES + nameBuf.length + deflated.length;
  }

  const directory = Buffer.concat(centralParts);
  return Buffer.concat([
    ...localParts,
    directory,
    endOfCentralDirectory({
      entryCount: files.length,
      directorySize: directory.length,
      directoryOffset: localHeaderOffset
    })
  ]);
}

const missing = marks.filter(m => !existsSync(path.join(publicBrand, m)));
if (missing.length > 0) {
  console.error(`[build-asset-kit] missing brand marks: ${missing.join(', ')}`);
  process.exit(1);
}

const archive = zipDeflatedFlat(
  marks.map(name => ({
    name,
    body: readFileSync(path.join(publicBrand, name))
  }))
);

if (existsSync(out) && readFileSync(out).equals(archive)) {
  console.log('[build-asset-kit] unchanged');
} else {
  if (existsSync(out)) unlinkSync(out);
  writeFileSync(out, archive);
  console.log(`[build-asset-kit] wrote ${path.relative(process.cwd(), out)}`);
}
