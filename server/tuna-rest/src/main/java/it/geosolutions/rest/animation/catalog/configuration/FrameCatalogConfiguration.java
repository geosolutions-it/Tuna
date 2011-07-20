/**
 * 
 */
package it.geosolutions.rest.animation.catalog.configuration;

import java.io.Serializable;

/**
 * @author Alessio
 *
 */
public class FrameCatalogConfiguration implements Serializable {
	
	public enum CatalogType {
		WMS_TIME, VIEWPARAMS
	}
	
	private static final long serialVersionUID = 4882827769421776113L;
	
	private Integer maxAllowedFrames;
	private CatalogType catalogType;
	// TODO: other info
	
	/**
	 * @param maxAllowedFrames the maxAllowedFrames to set
	 */
	public void setMaxAllowedFrames(Integer maxAllowedFrames) {
		this.maxAllowedFrames = maxAllowedFrames;
	}
	/**
	 * @return the maxAllowedFrames
	 */
	public Integer getMaxAllowedFrames() {
		return maxAllowedFrames;
	}
	
	/**
	 * @param catalogType the catalogType to set
	 */
	public void setCatalogType(CatalogType catalogType) {
		this.catalogType = catalogType;
	}
	/**
	 * @return the catalogType
	 */
	public CatalogType getCatalogType() {
		return catalogType;
	}
	
}
