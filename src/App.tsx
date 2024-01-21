import { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import * as htmlToImage from 'html-to-image';

type ImageType = '.png' | '.svg' | '.jpg';

function App() {
  const [input, setInput] = useState('https://en.wikipedia.org/wiki/QR_code');
  const qrRef = useRef<HTMLDivElement>(null);
  const [imageType, setImageType] = useState<ImageType>('.png');

  const onSubmitBtnClick = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      url: { value: string };
      imageType: { value: ImageType };
    };
    const type = target.imageType.value;
    const url = target.url.value;
    setImageType(type);
    setInput(url);
  };

  const onDownloadBtnClick = async () => {
    let dataUrl: string;
    switch (imageType) {
      case '.png':
        dataUrl = await htmlToImage.toPng(qrRef.current!);
        break;
      case '.jpg':
        dataUrl = await htmlToImage.toJpeg(qrRef.current!);
        break;
      case '.svg':
        dataUrl = await htmlToImage.toSvg(qrRef.current!);
        break;
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qr-code${imageType}`;
    link.click();
  };

  return (
    <div id="main-section">
      <h1>QR CODE GENERATOR</h1>
      <div className="form-and-qr-code">
        <form onSubmit={onSubmitBtnClick}>
          <div className="form-inputs">
            <label>
              Your URL
              <input
                id="url"
                required
                name="url"
                type="text"
                placeholder="Enter a URL"
              />
            </label>
            <label htmlFor="image-type">
              Select image type
              <select name="imageType" id="image-type">
                <option value=".png">.png</option>
                <option value=".jpg">.jpg</option>
                <option value=".svg">.svg</option>
              </select>
            </label>
          </div>
          <div className="card">
            <button type="submit">Create QR Code</button>
          </div>
        </form>

        <div className="qr-code-section">
          <div ref={qrRef} className="qr-code">
            <QRCode
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={input}
              viewBox={`0 0 0 0`}
              level="H"
            />
          </div>

          <button disabled={!qrRef.current} onClick={onDownloadBtnClick}>
            Download {imageType}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
