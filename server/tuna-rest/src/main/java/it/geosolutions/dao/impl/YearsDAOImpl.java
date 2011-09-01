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
 * @author Tobia di Pisa
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
