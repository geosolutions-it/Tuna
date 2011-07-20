/**
 * 
 */
package it.geosolutions.rest.animation.manager;

import it.geosolutions.rest.animation.catalog.FrameCatalog;
import it.geosolutions.rest.animation.catalog.visitor.FrameCatalogVisitor;
import it.geosolutions.rest.animation.service.Animator.AnimatorFormat.Key;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Logger;


/**
 * @author Alessio
 *
 */
public abstract class FrameManager {
	// TODO: concrete implementation of frame manager

	// default Logger
	private final static Logger LOGGER = Logger.getLogger(FrameManager.class.toString());
	
	public abstract void dispose();

	public Object render(FrameCatalog frameCatalog, Map<Key, Object> params) throws IOException {
		
		// TODO: create the response
		
		// TODO: create the concrete visitor depending on the selected outputFormat
		FrameCatalogVisitor visitor = null;
		
		frameCatalog.getFrames(visitor);
		
		return visitor.produce();
	}
	
}
