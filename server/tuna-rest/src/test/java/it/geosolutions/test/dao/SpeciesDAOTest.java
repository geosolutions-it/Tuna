package it.geosolutions.test.dao;

import it.geosolutions.model.Specie;

import java.util.List;

import org.junit.Test;

/**
 * SpeciesDAOTest class.
 * 
 * @author Tobia di Pisa
 *
 */
public class SpeciesDAOTest extends BaseDAOTest{

    @Test
    public void testGetSpecies() throws Exception {
    	List<Specie> species = speciesDAO.getSpecies();
    	
        assertNotNull("Species List Not null", species);
        assertTrue(species.size() > 0);        
    }
}
