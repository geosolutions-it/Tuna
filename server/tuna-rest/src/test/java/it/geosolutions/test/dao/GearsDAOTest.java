package it.geosolutions.test.dao;

import it.geosolutions.model.Gear;

import java.util.List;

import org.junit.Test;

/**
 * GearsDAOTest class.
 * 
 * @author Tobia di Pisa
 *
 */
public class GearsDAOTest extends BaseDAOTest{
	
    @Test
    public void testGetSpecies() throws Exception {
    	List<Gear> gears = gearsDAO.getGears();
    	
        assertNotNull("Gears Type List Not null", gears);
        assertTrue(gears.size() > 0);        
    }
}
