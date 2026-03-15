import { useState } from 'react'
import './LazyImage.css'

function LazyImage({ src, alt, className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className={`lazy-image ${className}`}>
      {!loaded && !errored && (
        <div className="lazy-image__placeholder">
          <div className="spinner"></div>
        </div>
      )}
      {errored ? (
        <div className="lazy-image__placeholder" aria-label={alt}>👤</div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`lazy-image__img ${loaded ? 'loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  )
}

export default LazyImage
