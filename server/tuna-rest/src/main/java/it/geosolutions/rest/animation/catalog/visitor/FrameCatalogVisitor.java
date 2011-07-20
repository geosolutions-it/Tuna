/**
 * 
 */
package it.geosolutions.rest.animation.catalog.visitor;

import it.geosolutions.rest.animation.model.Frame;

import java.io.IOException;

/**
 * @author Alessio
 *
 */
public interface FrameCatalogVisitor {

	public void visit(final Frame frame, Object o);
	
	public Object produce() throws IOException;
	
}
