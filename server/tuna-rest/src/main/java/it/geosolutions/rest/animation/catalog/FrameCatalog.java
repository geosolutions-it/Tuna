/**
 * 
 */
package it.geosolutions.rest.animation.catalog;

import it.geosolutions.rest.animation.catalog.visitor.FrameCatalogVisitor;


/**
 * @author Alessio
 *
 */
public interface FrameCatalog {

	void getFrames(FrameCatalogVisitor visitor);
	
	void dispose();
}
