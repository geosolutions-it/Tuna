package it.geosolutions.dao.impl;

import it.geosolutions.dao.SpeciesDAO;
import it.geosolutions.model.Specie;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.jdbc.support.rowset.SqlRowSet;

/**
 * SpeciesDAOImpl class.
 * 
 * @author Tobia di Pisa
 *
 */
public class SpeciesDAOImpl extends JdbcDaoSupport implements SpeciesDAO{
	private final static Logger LOGGER = Logger.getLogger(SpeciesDAOImpl.class.toString());

	public List<Specie> getSpecies(){		
		if(LOGGER.isLoggable(Level.INFO))
			LOGGER.info("Getting available Species");
		
		SqlRowSet sqlRowSet = getJdbcTemplate().queryForRowSet("SELECT " +
				"DISTINCT(FIC_ITEM.FIC_ITEM), LONG_NAME_E " +
				"FROM FIGIS.FIC_ITEM JOIN FIGIS.TS_FI_TA ON FIC_ITEM.FIC_ITEM = TS_FI_TA.FIC_ITEM " +
				"ORDER BY LONG_NAME_E"
	    );
		
		List<Specie> species = new ArrayList<Specie>();
		while(sqlRowSet.next()){
			int ficItem = sqlRowSet.getInt("FIC_ITEM");
			String name = sqlRowSet.getString("LONG_NAME_E");
			
			Specie specie = new Specie(ficItem, name);
			species.add(specie);
		}
		
		return species;
	}
}
