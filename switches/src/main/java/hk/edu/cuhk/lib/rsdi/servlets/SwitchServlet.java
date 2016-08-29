package hk.edu.cuhk.lib.rsdi.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.googlecode.objectify.ObjectifyService;

import hk.edu.cuhk.lib.rsdi.entities.ControlSwitches;

public class SwitchServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 4220329028069999432L;

	public static final String SWITCH_KEY = "K";
	public static final String SWITCH_VALUE = "V";

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException
	{
		String targetSwitchKey = req.getParameter(SWITCH_KEY);
		String targetSwitchValue = req.getParameter(SWITCH_VALUE);
		Gson gson = new Gson();
		try
		{
			List<ControlSwitches> controlSwitchesList = ObjectifyService.ofy().load().type(ControlSwitches.class).limit(1).list();
			ControlSwitches controlSwitches = new ControlSwitches();
			if (controlSwitchesList.size() > 0)
				controlSwitches = controlSwitchesList.get(0);
			
			if (targetSwitchKey != null && !targetSwitchKey.isEmpty())
			{
				switch (targetSwitchKey)
				{
				case ControlSwitches.VIDEO_WALL_SWITCH_KEY:
					controlSwitches.setVideoWallSwitch(targetSwitchValue);
					break;
				}
				ObjectifyService.ofy().save().entity(controlSwitches).now();

				controlSwitches = ObjectifyService.ofy().load().type(ControlSwitches.class).limit(1).list().get(0);
			}
			resp.setHeader("Content-Type", "text/plain");
			resp.setHeader("success", "yes");
			PrintWriter out = resp.getWriter();
			out.write(gson.toJson(controlSwitches));
			out.flush();
			out.close();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
	{
		doPost(req, resp);
	}
}
