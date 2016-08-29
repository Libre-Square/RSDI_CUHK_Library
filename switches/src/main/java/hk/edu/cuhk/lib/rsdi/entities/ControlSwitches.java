package hk.edu.cuhk.lib.rsdi.entities;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class ControlSwitches
{
	@Id
	public Long id;
	public static final String VIDEO_WALL_SWITCH_KEY = "V";

	private String videoWallSwitch;

	public String getVideoWallSwitch()
	{
		return videoWallSwitch;
	}

	public void setVideoWallSwitch(String videoWallSwitch)
	{
		this.videoWallSwitch = videoWallSwitch;
	}

}
