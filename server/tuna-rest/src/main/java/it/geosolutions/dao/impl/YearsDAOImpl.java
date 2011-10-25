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

import it.geosolutions.dao.YearsDAO;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.jdbc.support.rowset.SqlRowSet;

/**
 * Class YearsDAOImpl.
 * 
 * @author Tobia Di Pisa
 *
 */
public class YearsDAOImpl extends JdbcDaoSupport implements YearsDAO{
	private final static Logger LOGGER = Logger.getLogger(YearsDAOImpl.class.toString());
	
	public List<Integer> getYears(){
		if(LOGGER.isLoggable(Level.INFO))
			LOGGER.info("Getting available Years");
		
		SqlRowSet sqlRowSet = getJdbcTemplate().queryForRowSet("SELECT DISTINCT(YR_TA)" +
				" FROM FIGIS.TS_FI_TA ORDER BY YR_TA"
	    );
		
		List<Integer> years = new ArrayList<Integer>();
		while(sqlRowSet.next()){
			Integer year = Integer.valueOf(sqlRowSet.getInt("YR_TA"));
			years.add(year);
		}
		
		return years;
	}
	
}
