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

import java.util.logging.Level;
import java.util.logging.Logger;

import org.restlet.Application;
import org.restlet.Context;
import org.restlet.Restlet;
import org.restlet.Router;

/**
 * TUNAApplication class.
 * 
 * @author Tobia di Pisa
 *
 */
public class TUNAApplication extends Application {

	private final static Logger LOGGER = Logger.getLogger(TUNAApplication.class.toString());
	
	private static TUNADispatcher manager;

	public TUNAApplication() {
        super();
	} 
	
	public TUNAApplication(Context context) {
        super(context);
	}

	public void setManager(TUNADispatcher manager) {
		TUNAApplication.manager = manager;
	}

	@Override
	public Restlet createRoot() {
		Router router = new Router(getContext());

		if (LOGGER.isLoggable(Level.INFO))
			LOGGER.info("Initializing the REST Router");
		
		// /////////////////////////////////////////////
		// The returned instance of TUNA DIspatcher class is used to configure the router
		// /////////////////////////////////////////////
		manager.init(router);
		

		return router;
	}
}