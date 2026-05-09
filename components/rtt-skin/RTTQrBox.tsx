type RTTQrBoxProps = {
  src?: string;
  label?: string;
};

export function RTTQrBox({ src, label = "COURT QR" }: RTTQrBoxProps) {
  return (
    <div className="rttb-qr-box" aria-label={label}>
      {src ? <img src={src} alt={label} /> : <span className="rttb-qr-fallback" aria-hidden="true" />}
      <span className="rttb-qr-label">{label}</span>
    </div>
  );
}
