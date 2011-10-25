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
 * @author Tobia Di Pisa
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
