package it.geosolutions.dao.impl;

import it.geosolutions.dao.GearsDAO;
import it.geosolutions.model.Gear;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.jdbc.support.rowset.SqlRowSet;

/**
 * GearsDAOImpl class.
 * 
 * @author Tobia di Pisa
 *
 */
public class GearsDAOImpl extends JdbcDaoSupport implements GearsDAO{
	private final static Logger LOGGER = Logger.getLogger(GearsDAOImpl.class.toString());
	
	public List<Gear> getGears(){		
		SqlRowSet sqlRowSet = getJdbcTemplate().queryForRowSet("SELECT " +
				"DISTINCT(REF_GEAR_TYPE.CD_GEAR_TYPE), NAME_E " +
				"FROM REF_GEAR_TYPE JOIN TS_FI_TA ON REF_GEAR_TYPE.CD_GEAR_TYPE = TS_FI_TA.CD_GEAR " +
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
