/**
 * 
 */
package it.geosolutions.rest.animation.catalog.impl;

import it.geosolutions.rest.animation.catalog.FrameCatalog;
import it.geosolutions.rest.animation.catalog.configuration.FrameCatalogConfiguration;
import it.geosolutions.rest.animation.catalog.visitor.FrameCatalogVisitor;
import it.geosolutions.rest.animation.model.Frame;

/**
 * @author Alessio
 *
 */
public class ViewParamsFrameCatalog implements FrameCatalog {

	public ViewParamsFrameCatalog(FrameCatalogConfiguration catalogConfig, String requestURL) {
		// TODO Auto-generated constructor stub
	}

	/* (non-Javadoc)
	 * @see it.geosolutions.rest.animation.catalog.FrameCatalog#dispose()
	 */
	public void dispose() {
		// TODO Auto-generated method stub

	}

	/* (non-Javadoc)
	 * @see it.geosolutions.rest.animation.catalog.FrameCatalog#getFrames(it.geosolutions.rest.animation.catalog.visitor.FrameCatalogVisitor)
	 */
	public void getFrames(FrameCatalogVisitor visitor) {
		// TODO Auto-generated method stub

		// TODO: for all frames:
			Frame frame = null;
			visitor.visit(frame, null /* TODO: progress listener */);
	}

}
