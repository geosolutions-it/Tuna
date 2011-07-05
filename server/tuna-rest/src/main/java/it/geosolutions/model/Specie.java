package it.geosolutions.model;

/**
 * Specie class.
 * 
 * @author Tobia di Pisa
 *
 */
public class Specie {

	private int ficItem;
	
	private String name;
	
	public Specie(int ficItem, String name) {
		super();
		this.ficItem = ficItem;
		this.name = name;
	}
	
	public int getFicItem() {
		return ficItem;
	}
	
	public void setFicItem(int ficItem) {
		this.ficItem = ficItem;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}	
}
