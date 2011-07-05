package it.geosolutions.dao;

import it.geosolutions.model.Gear;

import java.util.List;

import org.springframework.dao.DataAccessException;

/**
 * GearsDAO interface.
 * 
 * @author Tobia di Pisa
 *
 */
public interface GearsDAO {

	public List<Gear> getGears() throws DataAccessException;
	
}
