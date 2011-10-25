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
package it.geosolutions.rest;

import it.geosolutions.dao.SpeciesDAO;
import it.geosolutions.model.Specie;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import net.sf.json.JSONArray;

import org.restlet.Restlet;
import org.restlet.data.MediaType;
import org.restlet.data.Method;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;

/**
 * SpeciesDataRestlet class.
 * 
 * @author Tobia Di Pisa
 *
 */
public class SpeciesDataRestlet extends Restlet{

	private final static Logger LOGGER = Logger.getLogger(SpeciesDataRestlet.class.toString());

	private SpeciesDAO daoSpecies;

	public void setDaoSpecies(SpeciesDAO daoSpecies) {
		this.daoSpecies = daoSpecies;
	}
	
	/**
	 *  
	 * @param request
	 *            a request
	 * @param response
	 *            the answer supplied after the elaboration of the request
	 * @return void
	 * 
	 * @see org.restlet.Restlet#handle(org.restlet.data.Request,
	 *      org.restlet.data.Response)
	 */
	public void handle(Request request, Response response) {
     	if (request.getMethod().equals(Method.GET)) {             		
			if(LOGGER.isLoggable(Level.INFO))
				LOGGER.info("Handling the call for Species ...");
            
			// //////////////////////////////////////
			// Getting the Species List
			// //////////////////////////////////////
			List<Specie> species = daoSpecies.getSpecies();			
			JSONArray jsonArray = JSONArray.fromObject(species);
			
            response.setStatus(Status.SUCCESS_OK);
            response.setEntity(jsonArray.toString(), MediaType.TEXT_PLAIN);			
        }else {
            response.setStatus(Status.SERVER_ERROR_NOT_IMPLEMENTED);
            response.setEntity("Requested resource not implemented", MediaType.TEXT_PLAIN);
        } 
    }
}