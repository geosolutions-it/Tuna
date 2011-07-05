package it.geosolutions.test.dao;

import it.geosolutions.dao.GearsDAO;
import it.geosolutions.dao.SpeciesDAO;

import java.util.logging.Logger;

import junit.framework.TestCase;

import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;


/**
 * BaseDAOTest abstract class.
 * 
 * @author Tobia di Pisa
 *
 */
public abstract class BaseDAOTest extends TestCase {
    
	protected final Logger LOGGER;

    protected static ClassPathXmlApplicationContext ctx = null;

    protected static SpeciesDAO speciesDAO;
    protected static GearsDAO gearsDAO;

    public BaseDAOTest() {
        LOGGER = Logger.getLogger(getClass().toString());

        synchronized(BaseDAOTest.class) {
            if(ctx == null) {
                String[] paths = {
                        "applicationContext.xml"
                };
                
                ctx = new ClassPathXmlApplicationContext(paths);

                speciesDAO = (SpeciesDAO)ctx.getBean("SpeciesDAO");
                gearsDAO = (GearsDAO)ctx.getBean("GearsDAO");
            }
        }
    }

    @Override
    protected void setUp() throws Exception {
        super.setUp();
    }
    
    @Test
    public void testCheckDAOs() {
        assertNotNull(speciesDAO);
        assertNotNull(gearsDAO);
    }
}
