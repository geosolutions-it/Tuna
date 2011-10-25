/*
 *  Copyright (C) 2007 - 2011 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
