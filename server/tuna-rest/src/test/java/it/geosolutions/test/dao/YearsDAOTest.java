package it.geosolutions.test.dao;

import java.util.List;

import org.junit.Test;

/**
 * YearsDAOTest test class.
 * 
 * @author Tobia di Pisa
 *
 */
public class YearsDAOTest extends BaseDAOTest{

    @Test
    public void testGetYears() throws Exception {
    	List<Integer> years = yearsDAO.getYears();
    	
        assertNotNull("Years List Not null", years);
        assertTrue(years.size() > 0);        
    }
}
