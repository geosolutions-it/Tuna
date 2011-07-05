package it.geosolutions.dao;

import java.util.List;

import it.geosolutions.model.Specie;

import org.springframework.dao.DataAccessException;

/**
 * SpeciesDAO interface.
 * 
 * @author Tobia di Pisa
 *
 */
public interface SpeciesDAO {
	
	public List<Specie> getSpecies() throws DataAccessException;
	
}
