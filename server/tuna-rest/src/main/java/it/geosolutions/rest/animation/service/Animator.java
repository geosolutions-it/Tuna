/**
 * 
 */
package it.geosolutions.rest.animation.service;

import it.geosolutions.rest.animation.catalog.FrameCatalog;
import it.geosolutions.rest.animation.catalog.configuration.FrameCatalogConfiguration;
import it.geosolutions.rest.animation.catalog.configuration.FrameCatalogConfiguration.CatalogType;
import it.geosolutions.rest.animation.catalog.factory.FrameCatalogFactory;
import it.geosolutions.rest.animation.manager.FrameManager;
import it.geosolutions.rest.animation.service.Animator.AnimatorFormat.Key;
import it.geosolutions.rest.animation.service.exception.InitializationException;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Alessio
 * 
 */
public class Animator {

	// ////////////////////////////////////////////////////////////////////////
	// PRIVATE VARIABLES
	// ///////////////////////////////////////////////////////////////////////

	// default Logger
	private final static Logger LOGGER = Logger.getLogger(Animator.class.toString());

	ExecutorService multiThreadedLoader = null;
	private FrameCatalog frameCatalog;
	private FrameManager frameManager;
	private Integer maxAllowedFrames = (Integer) AnimatorFormat.DEFAULT_MAX_ALLOWED_FRAMES.getDefaultValue();
	private Integer frameRate = (Integer) AnimatorFormat.DEFAULT_FRAME_RATE.getDefaultValue();
	private String  outputFormat = (String) AnimatorFormat.DEFAULT_OUTPUT_FORMAT.getDefaultValue();

	@SuppressWarnings("unused")
	private Animator() {
		// cannot be created without the request
	}

	// ////////////////////////////////////////////////////////////////////////
	// PUBLIC CONSTRUCTORS
	// ///////////////////////////////////////////////////////////////////////
	public static class AnimatorFormat {
		
		public enum Key {
			EXECUTOR_SERVICE,
			MAX_ALLOWED_FRAMES, 
			FRAME_RATE,
			OUTPUT_FORMAT;
		}
		
		static AnimatorFormat DEFAULT_MAX_ALLOWED_FRAMES = new AnimatorFormat(Key.MAX_ALLOWED_FRAMES, null, Integer.MAX_VALUE);
		static AnimatorFormat DEFAULT_FRAME_RATE = new AnimatorFormat(Key.FRAME_RATE, null, 10);
		static AnimatorFormat DEFAULT_OUTPUT_FORMAT = new AnimatorFormat(Key.OUTPUT_FORMAT, "GIF", "GIF");

		private final Key key;
		private final Object value;
		private final Object defaultValue;

		public AnimatorFormat(Key key, Object value, Object defaultValue) {
			this.key = key;
			this.value = value;
			this.defaultValue = defaultValue;
		}

		// Getter and setter
		public Key getKey() {
			return key;
		}

		public Object getValue() {
			return value;
		}

		public Object getDefaultValue() {
			return defaultValue;
		}
	}

	public Animator(String requestURL, AnimatorFormat[] hints) throws InitializationException {
		if (hints != null) {
			for (AnimatorFormat hint : hints) {
				if (hint.getKey() == AnimatorFormat.Key.EXECUTOR_SERVICE) {
					final Object executor = hint.getValue();
					if (executor != null && executor instanceof ExecutorService) {
						multiThreadedLoader = (ExecutorService) executor;
						if (LOGGER.isLoggable(Level.FINE)) {
							if (multiThreadedLoader instanceof ThreadPoolExecutor) {
								final ThreadPoolExecutor tpe = (ThreadPoolExecutor) multiThreadedLoader;
								LOGGER.fine("Using ThreadPoolExecutor with the following settings: "
										+ "core pool size = "
										+ tpe.getCorePoolSize()
										+ "\nmax pool size = "
										+ tpe.getMaximumPoolSize()
										+ "\nkeep alive time "
										+ tpe.getKeepAliveTime(TimeUnit.MILLISECONDS));
							}
						}
					}
				}

				if (hint.getKey() == AnimatorFormat.Key.MAX_ALLOWED_FRAMES)
					this.maxAllowedFrames = ((Integer) hint.getValue());

				if (hint.getKey() == AnimatorFormat.Key.FRAME_RATE)
					this.frameRate = ((Integer) hint.getValue());
				
				if (hint.getKey() == AnimatorFormat.Key.OUTPUT_FORMAT)
					this.outputFormat = ((String) hint.getValue());
				
			}
		}

		initFromRequestURL(requestURL);
	}

	// ////////////////////////////////////////////////////////////////////////
	// PUBLIC METHODS
	// ///////////////////////////////////////////////////////////////////////
	public Object produce() throws IOException {
		// TODO: implement this
		
		// TODO: integrity checks ... frameManager != null, etc...
		
		Map<Key, Object> params = new HashMap<AnimatorFormat.Key, Object>();
		params.put(AnimatorFormat.Key.MAX_ALLOWED_FRAMES, this.maxAllowedFrames);
		params.put(AnimatorFormat.Key.FRAME_RATE, this.frameRate);
		params.put(AnimatorFormat.Key.EXECUTOR_SERVICE, this.multiThreadedLoader);
		params.put(AnimatorFormat.Key.OUTPUT_FORMAT, this.outputFormat);
		
		return this.frameManager.render(this.frameCatalog, params /* TODO: params */);
	}

	public synchronized void dispose() {
		try {
			if (frameManager != null)
				frameManager.dispose();
			
			if (frameCatalog != null)
				frameCatalog.dispose();
			
		} catch (Exception e) {
			if (LOGGER.isLoggable(Level.FINE))
				LOGGER.log(Level.FINE, e.getLocalizedMessage(), e);
		} finally {
			frameManager = null;
		}
	}
	
	// ////////////////////////////////////////////////////////////////////////
	// PRIVATE/UTILITY METHODS
	// ///////////////////////////////////////////////////////////////////////
	void initFromRequestURL(String URL) throws InitializationException {
		// TODO: implement this
		
		// TODO: URL validity checks
		
		// TODO: automatic regex catalog type extraction from URL
		FrameCatalogConfiguration catalogConfig = new FrameCatalogConfiguration();
		catalogConfig.setCatalogType(CatalogType.VIEWPARAMS);
		catalogConfig.setMaxAllowedFrames(maxAllowedFrames);
		this.frameCatalog = FrameCatalogFactory.getCatalog(catalogConfig, URL);
		
		// TODO: error... rise up initialization exceptions
		if(frameCatalog==null) {
			InitializationException ex = new InitializationException();
			ex.initCause(new Throwable("Unable to create catalog for Request URL: " + URL));
			throw ex;
		}
		
		// TODO: initialize the frame manager
		this.frameManager = null /* TODO: concrete implementation of frame manager */ ;
	}
}
