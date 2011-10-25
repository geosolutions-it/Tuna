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

import it.geosolutions.dao.GearsDAO;
import it.geosolutions.model.Gear;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.jdbc.support.rowset.SqlRowSet;

/**
 * GearsDAOImpl class.
 * 
 * @author Tobia Di Pisa
 *
 */
public class GearsDAOImpl extends JdbcDaoSupport implements GearsDAO{
	private final static Logger LOGGER = Logger.getLogger(GearsDAOImpl.class.toString());
	
	public List<Gear> getGears(){		
		if(LOGGER.isLoggable(Level.INFO))
			LOGGER.info("Getting available Gears");
		
		SqlRowSet sqlRowSet = getJdbcTemplate().queryForRowSet("SELECT " +
				"DISTINCT(REF_GEAR_TYPE.CD_GEAR_TYPE), NAME_E " +
				"FROM FIGIS.REF_GEAR_TYPE JOIN FIGIS.TS_FI_TA ON REF_GEAR_TYPE.CD_GEAR_TYPE = TS_FI_TA.CD_GEAR " +
				"ORDER BY REF_GEAR_TYPE.CD_GEAR_TYPE"
		);
		
		List<Gear> gears = new ArrayList<Gear>();
		while(sqlRowSet.next()){
			int gearType = sqlRowSet.getInt("CD_GEAR_TYPE");
			String name = sqlRowSet.getString("NAME_E");
			
			Gear gear = new Gear(gearType, name);
			gears.add(gear);
		}
		
		return gears;
	}
}
