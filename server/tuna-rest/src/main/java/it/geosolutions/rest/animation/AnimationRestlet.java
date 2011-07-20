/**
 * 
 */
package it.geosolutions.rest.animation;

import it.geosolutions.rest.animation.service.Animator;
import it.geosolutions.rest.animation.service.Animator.AnimatorFormat;
import it.geosolutions.rest.animation.service.Animator.AnimatorFormat.Key;

import java.io.IOException;
import java.io.OutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.restlet.Restlet;
import org.restlet.data.MediaType;
import org.restlet.data.Method;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;
import org.restlet.resource.OutputRepresentation;
import org.restlet.resource.Representation;

/**
 * @author Alessio
 *
 */
public class AnimationRestlet extends Restlet {

	private final static Logger LOGGER = Logger.getLogger(AnimationRestlet.class.toString());

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
			if(LOGGER.isLoggable(Level.FINER))
				LOGGER.finer("Handling the call for generating animation ...");

			final MediaType type    = MediaType.valueOf((String) request.getAttributes().get("type"));
			final String requestURL = request.getEntityAsForm().getFirstValue("url");
			
			AnimatorFormat[] hints = new AnimatorFormat[] {
					new AnimatorFormat(Key.EXECUTOR_SERVICE, null, null),
					new AnimatorFormat(Key.MAX_ALLOWED_FRAMES, null, Integer.MAX_VALUE),
					new AnimatorFormat(Key.FRAME_RATE, null, 10),
					new AnimatorFormat(Key.OUTPUT_FORMAT, type == MediaType.VIDEO_AVI ? "AVI" : "GIF", "GIF")
			};
			
			try {
				Animator animator = new Animator(requestURL, hints);
				
				Object output = animator.produce();

				Representation entity = new OutputRepresentation(type) {
					
					@Override
					public void write(OutputStream out) throws IOException {
						// TODO Auto-generated method stub
					}
				};
				
	            response.setStatus(Status.SUCCESS_OK);
	            response.setEntity(entity);			
			} catch (Exception e) {
				LOGGER.severe(e.getLocalizedMessage());
	            response.setStatus(Status.SERVER_ERROR_INTERNAL);
	            response.setEntity("Could not produce animation", MediaType.TEXT_PLAIN);
			}
        }else {
            response.setStatus(Status.SERVER_ERROR_NOT_IMPLEMENTED);
            response.setEntity("Requested resource not implemented", MediaType.TEXT_PLAIN);
        } 
    }
	
}