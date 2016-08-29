var Foldable = Foldable || {};

Foldable.PAGE_TYPE_UP = "U";
Foldable.PAGE_TYPE_DOWN = "D";
Foldable.PAGE_TYPE_COVER = "C";
Foldable.MAX_UNFOLD_ANGLE = 65;

Foldable.Page = function(div, index)
{
	if (div == null || div.tagName != 'DIV')
		return null;
	
	this.div = div;
	this.index = index;	
	this.width = this.div.offsetWidth;
	this.height = this.div.offsetHeight;
	this.X = this.div.offsetLeft;
	this.type = index % 2 == 0 ? Foldable.PAGE_TYPE_DOWN : Foldable.PAGE_TYPE_UP;
	this.foldBaseLength = this.width * Math.cos(Foldable.MAX_UNFOLD_ANGLE * Math.PI / 180);
	this.flatteningX = 0;
	this.flattenedX = 0;
	
	this.offset = 0;
	this.tiltAngle = 0;
	this.scale = 0;
}

Foldable.Page.prototype.render = function()
{
	this.div.style.zIndex = this.index;
	this.div.style.left = this.X;
	this.div.style.transform = "translateX(" + this.offset + "px) rotateY(" + this.tiltAngle + "deg) scaleX(" + this.scale + ")";
	this.div.style.transformOrigin = (this.type == Foldable.PAGE_TYPE_UP) ? "center left" : "center right";
};

Foldable.Book = function(bookDiv)
{
	if (bookDiv == null || bookDiv.tagName != 'DIV')
		return null;

	this.width = 0;
	this.height = 0;
	this.pages = new Array();
	
	var pageDivs = bookDiv.getElementsByClassName('page');
	if (pageDivs == null || pageDivs.length <= 0)
		return null;
	
	for (var idx = 0; idx < pageDivs.length - 1; idx++)
	{
		var page = new Page(pageDivs[idx], idx);
		this.pages.push(page);
		this.width += page.offsetWidth;
		this.height = page.offsetHeight > this.height ? page.offsetHeight : this.height;
	}
	
	var lastflatteningXfront = 0;
	var lastflattenedXfront = 0;
	for (var idx = this.pages.length-1; idx >= 0; idx--)
	{
		var page = this.pages[idx];
		if (idx == pageDivs.length - 1 && page.type == Foldable.PAGE_TYPE_UP)
		{
			page.flatteningX = page.width;
			page.flattenedX = page.width;
		}
		else if (idx == pageDivs.length - 1 && page.type == Foldable.PAGE_TYPE_DOWN)
		{
			page.flatteningX = page.width + page.foldBaseLength;
			page.flattenedX = page.width + page.width;
		}
		else
		{
			page.flatteningX = lastflatteningXfront + page.foldBaseLength;
			page.flattenedX = lastflattenedXfront + page.width;
		}
		
		lastFlatteningXfront += page.flatteningX;
		lastflattenedXfront += page.width;
	}
	//bookDiv.addEventListener("mousedown", startDrag);
	//bookDiv.addEventListener("mouseup", stopDrag);
}

Foldable.Book.prototype.render = function(unfoldPercentage)
{
	if (unfoldPercentage == null || unfoldPercentage < 0 || unfoldPercentage > 100 || this.pages == null || this.pages.length <= 0)
		return;
	
	var Xfront = this.width * unfoldPercentage / 100;
	var lastPageX = Xfront;
	for (var idx = 0; idx < this.pages.length; idx++)
	{
		if (lastPageX < page.width)
			break;
		
		var page = this.pages[idx];
		if (idx == this.pages.length - 1)
			break;
		
		if (page.type == Foldable.PAGE_TYPE_UP)
		{
			var rotateStopX = page.width + page.foldBaseLength + this.pages[idx + 1].foldBaseLength
			if (lastPageX > page.width && lastPageX <= rotateStopX)
				page.tiltAngle = Foldable.MAX_UNFOLD_ANGLE * (lastPageX - page.width) / (rotateStopX - page.width);
			else if (lastPageX > page.flatteningX)
				page.tiltAngle = Foldable.MAX_UNFOLD_ANGLE * (1 - (lastPageX - page.flatteningX) / (page.flattenedX - page.flatteningX));
			page.X = lastPageX - page.width;
		}
		else if (page.type == Foldable.PAGE_TYPE_DOWN)
		{	
			/*
			var rotateStopX = page.width + page.foldBaseLength + this.pages[idx + 1].foldBaseLength
			if (lastPageX > page.width && lastPageX <= rotateStopX)
				page.tiltAngle = Foldable.MAX_UNFOLD_ANGLE * (lastPageX - page.width) / (rotateStopX - page.width);
			else if (lastPageX > page.flatteningX)
				page.tiltAngle = Foldable.MAX_UNFOLD_ANGLE * (1 - (lastPageX - page.flatteningX) / (page.flattenedX - page.flatteningX));
			page.X = lastPageX - page.width;
			*/
		}
		
		lastPageX = page.X;
	}
	
	///////////////////////////////////////////
	if (PAGES_LIST.length <= 0)
		return;
	var firstPage = PAGES_LIST[0];
	var previousPageLeftOffset = (firstPageOffsetX < MIN_FIRST_PAGE_X) ? MIN_FIRST_PAGE_X : (firstPageOffsetX > MAX_FIRST_PAGE_X ? MAX_FIRST_PAGE_X : firstPageOffsetX);
	firstPage.style.left = previousPageLeftOffset;
	var previousFlipPage = firstPage;
	for (idx = 1; idx < PAGES_LIST.length; idx++)
	{
		var page = PAGES_LIST[idx];
			
		if (idx % 2 == 0)
		{
			previousPageLeftOffset = previousFlipPage.offsetLeft - previousPage.offsetWidth;
			previousPageLeftOffset = previousPageLeftOffset < MIN_FIRST_PAGE_X ? MIN_FIRST_PAGE_X : previousPageLeftOffset;
			previousPage.style.left = previousPageLeftOffset;
			
			var tiltAngle = 0;
			var flipAngle = 180;
			var translateOffset = 0;
			if (previousPageLeftOffset < MIN_FIRST_PAGE_X + previousPage.offsetWidth + page.offsetWidth)
			{
				if (previousPageLeftOffset <= MIN_FIRST_PAGE_X + previousPage.offsetWidth)
				{
					var ratio = (previousPageLeftOffset - MIN_FIRST_PAGE_X) / previousPage.offsetWidth;
					//tiltAngle = 80 * ratio;
					tiltAngle = 65 * ratio;
				}
				else
				{
					var ratio = (previousPageLeftOffset - MIN_FIRST_PAGE_X - previousPage.offsetWidth) / page.offsetWidth;
					//tiltAngle = 80 * (1 - ratio);
					tiltAngle = 65 * (1 - ratio);
				}
				previousPage.style.transform = "translateX(" + translateOffset + "px) rotateY(" + tiltAngle + "deg)";
				
				if (tiltAngle > 0)
				{
					var baseL = previousPage.offsetWidth * Math.cos(tiltAngle * Math.PI / 180);
					var dropL = previousPage.offsetWidth * Math.sin(tiltAngle * Math.PI / 180);
					var dropOffset = previousFlipPage.offsetLeft - baseL;
					var scale = 0;
					if (dropOffset < MIN_FIRST_PAGE_X + page.offsetWidth)
					{
						var flipAngleRad = Math.atan(dropL / (MIN_FIRST_PAGE_X + page.offsetWidth - dropOffset));
						scale = dropL / Math.sin(flipAngleRad);
						flipAngle = 180 + flipAngleRad * 180 / Math.PI;
					}
					else
					{
						var flipAngleRad = Math.atan(dropL / (previousFlipPage.offsetLeft - baseL - MIN_FIRST_PAGE_X - page.offsetWidth));
						scale = dropL / Math.sin(flipAngleRad);
						flipAngle = 360 - flipAngleRad * 180 / Math.PI;
					}
					scale = scale / page.offsetWidth;
					page.style.transform = "translateX(" + page.offsetWidth + "px) rotateY(" + flipAngle + "deg) scaleX(" + scale + ")";
				}
				else
				{
					page.style.transform = "translateX(0px) rotateY(0deg) scaleX(1.0)";
				}
				page.style.left = MIN_FIRST_PAGE_X;
			}
			else
			{
				page.style.left = previousPageLeftOffset - page.offsetWidth;
				previousPage.style.transform = "translateX(0px) rotateY(0deg)";
				page.style.transform = "translateX(0px) rotateY(0deg)";
			}
			previousFlipPage = page;
		}
		previousPage = page;
	}
}



