function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      const bit = ((charCode >> (7 - j)) & 1) === 1;
      const c15 = ((crc >> 15) & 1) === 1;
      crc <<= 1;
      if (c15 !== bit) {
        crc ^= polynomial;
      }
    }
  }

  crc &= 0xFFFF;
  let crcStr = crc.toString(16).toUpperCase();
  return crcStr.padStart(4, '0');
}

export function generatePixPayload(key: string, amount: number, name: string = 'Presente Magico', city: string = 'Sao Paulo'): string {
  const formatTag = (id: string, value: string) => id + value.length.toString().padStart(2, '0') + value;

  const gui = formatTag('00', 'br.gov.bcb.pix');
  const keyTag = formatTag('01', key.replace(/\s/g, ''));
  const merchantAccountInfo = formatTag('26', gui + keyTag);

  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25);
  const cleanCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 15);

  const payloadParts = [
    formatTag('00', '01'),
    merchantAccountInfo,
    formatTag('52', '0000'),
    formatTag('53', '986'),
    formatTag('54', amount.toFixed(2)),
    formatTag('58', 'BR'),
    formatTag('59', cleanName),
    formatTag('60', cleanCity),
    formatTag('62', formatTag('05', '***'))
  ];

  const payloadWithoutCRC = payloadParts.join('') + '6304';
  const crc = calculateCRC16(payloadWithoutCRC);
  return payloadWithoutCRC + crc;
}
