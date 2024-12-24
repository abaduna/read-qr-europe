import { useEffect, useState } from "react";
import Quagga from 'quagga';

function App() {
  const [barcode, setBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const startScanner = () => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#video"),
        constraints: {
          facingMode: "environment",
          width: 640,
          height: 480,
        },
      },
      decoder: {
        readers: [
          "ean_reader",
          "ean_8_reader",
          "upc_reader",
          "upc_e_reader"
        ],
        debug: {
          showCanvas: true,
          showPatches: true,
          showFoundPatches: true,
          showSkeleton: true,
          showLabels: true,
          showPatchLabels: true,
          showRemainingPatchLabels: true,
          boxFromPatches: {
            showTransformed: true,
            showTransformedBox: true,
            showBB: true
          }
        }
      }
    }, function(err) {
      if (err) {
        console.error(err);
        return;
      }
      console.log("QuaggaJS initialization succeeded");
      setIsScanning(true);
      Quagga.start();
    });

    Quagga.onDetected((result) => {
      if (result && result.codeResult) {
        console.log("Barcode detected:", result.codeResult.code);
        setBarcode(result.codeResult.code);
        stopScanner();
      }
    });
  };

  const stopScanner = () => {
    if (isScanning) {
      Quagga.stop();
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="scanner-container">
      <h1>Escáner de Código de Barras</h1>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "640px",
          height: "480px",
          background: "#000",
        }}
      >
        <div id="video" />
      </div>

      {barcode && (
        <div className="result">
          <h2>Resultado del Escaneo:</h2>
          <p>{barcode}</p>
          <button onClick={() => {
            setBarcode("");
            startScanner();
          }}>Escanear otro código</button>
        </div>
      )}

      {!isScanning ? (
        <button onClick={startScanner}>Iniciar Escáner</button>
      ) : (
        <button onClick={stopScanner}>Detener Escáner</button>
      )}
    </div>
  );
}

export default App;
