/**
 * 
 */
package it.geosolutions.rest.animation.catalog.factory;

import it.geosolutions.rest.animation.catalog.FrameCatalog;
import it.geosolutions.rest.animation.catalog.configuration.FrameCatalogConfiguration;
import it.geosolutions.rest.animation.catalog.impl.ViewParamsFrameCatalog;
import it.geosolutions.rest.animation.catalog.impl.WMSTimeFrameCatalog;

/**
 * @author Alessio
 * 
 */
public class FrameCatalogFactory {

	public static FrameCatalog getCatalog(FrameCatalogConfiguration catalogConfig, String requestURL) {
		switch (catalogConfig.getCatalogType()) {
		case WMS_TIME:
			return new WMSTimeFrameCatalog(catalogConfig, requestURL);
		case VIEWPARAMS:
			return new ViewParamsFrameCatalog(catalogConfig, requestURL);
		default:
			return null;
		}
	}
}
