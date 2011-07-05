/**
 * 
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