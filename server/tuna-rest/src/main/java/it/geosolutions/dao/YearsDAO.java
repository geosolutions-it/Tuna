package it.geosolutions.dao;

import java.util.List;

import org.springframework.dao.DataAccessException;

/**
 * Interface YearsDAO.
 * 
 * @author Tobia di Pisa
 *
 */
public interface YearsDAO {
	
	public List<Integer> getYears() throws DataAccessException;
	
}
