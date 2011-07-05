package it.geosolutions.app;

import java.util.HashMap;
import java.util.Map;

import org.restlet.Restlet;
import org.restlet.Router;


/**
 * TUNADispatcher class.
 * 
 * @author Tobia Di Pisa 
 */
public class TUNADispatcher {
	private Map<String, Restlet> resourceMappings = new HashMap<String, Restlet>();

	public void init(Router router) {
		for (String key : resourceMappings.keySet()) {
			
			// /////////////////////////////////
			// Getting the restlet's instances from the Spring context
			// /////////////////////////////////
			
			router.attach(key, resourceMappings.get(key));
		}
	}
	
	public void setResourceMappings(HashMap<String, Restlet> resourceMappings) {
		this.resourceMappings = resourceMappings;
	}
}
