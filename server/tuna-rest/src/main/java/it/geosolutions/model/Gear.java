package it.geosolutions.model;

/**
 * Gear class.
 * 
 * @author Tobia di Pisa
 *
 */
public class Gear {
	
	private int gearType;
	
	private String name;

	public Gear(int gearType, String name) {
		super();
		this.gearType = gearType;
		this.name = name;
	}

	public int getGearType() {
		return gearType;
	}

	public void setGearType(int gearType) {
		this.gearType = gearType;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
}
