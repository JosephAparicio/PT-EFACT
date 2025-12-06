export function formatXml(xml: string): string {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;

    xml = xml.replace(reg, '$1\r\n$2$3');

    const lines = xml.split('\r\n');

    for (let i = 0; i < lines.length; i++) {
        let indent = 0;
        const line = lines[i];

        if (line.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (line.match(/^<\/\w/) && pad > 0) {
            pad -= 1;
        } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        formatted += PADDING.repeat(pad) + line + '\r\n';
        pad += indent;
    }

    return formatted.trim();
}
