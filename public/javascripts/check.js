/*
* @Author: 10261
* @Date:   2017-07-30 12:58:57
* @Last Modified by:   10261
* @Last Modified time: 2017-07-30 13:16:00
*/

'use strict';

onmessage = function (mEast, mWest, mSouth, mNorth, block, gravity) {
    var col = [false, false, false, false];
    for (var i = 0; i < block.length; i++) {
    	var item = block[i],
    	    iNorth = item.y,
    	    iSouth = item.y + item.height,
    	    iEast = item.x + item.width,
    	    iWest = item.x;
    	switch (gravity) {
    		case ("east"): {
    			if (mWest - 20 < iEast && mEast > iWest && mNorth < iSouth && mSouth > iNorth) {
    				console.log(i, "top");
    				col[0] = true;
    			}
    			if (mNorth - 10 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
    				console.log(i, "right");
    				col[1] = true;
    			}
    			if (mEast + 20 > iWest && mWest < iEast && mSouth > iNorth && mNorth < iSouth) {
    				console.log(i, "bottom");
    				col[2] = true;
    			}
    			if (mSouth + 10 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
    				console.log(i, "left");
    				col[3] = true;
    			}
    			break;
    		}
    		case ("south"): {
    			if (mNorth - 20 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
    				console.log(i, "top");
    				col[0] = true;
    			} 
    			if (mEast + 10 > iWest && mWest < iEast && mNorth < iSouth && mSouth > iNorth) {
    				console.log(i, "right");
    				col[1] = true;
    			} 
    			if (mSouth + 20 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
    				console.log(i, "bottom");
    				col[2] = true;
    			}
    			if (mWest - 10 < iEast && mEast > iWest && mNorth < iSouth && mSouth > iNorth) {
    				console.log(i, "left");
    				col[3] = true;
    			}
    			break;
    		}
    		case ("west"): {
    			if (mEast + 20 > iWest && mWest < iEast && mSouth > iNorth && mNorth < iSouth) {
    				console.log(i, "top");
    				col[0] = true;
    			}
    			if (mSouth + 10 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
    				console.log(i, "right");
    				col[1] = true;
    			}
    			if (mWest - 20 < iEast && mEast > iWest && mSouth > iNorth && mNorth < iSouth) {
    				console.log(i, "bottom");
    				col[2] = true;
    			}
    			if (mNorth - 10 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
    				console.log(i, "left");
    				col[3] = true;
    			}
    			break;
    		}
    		case ("north"): {
    			if (mSouth + 20 > iNorth && mNorth < iSouth && mEast > iWest && mWest < iEast) {
    				console.log(i, "top");
    				col[0] = true;
    			}
    			if (mWest - 10 < iEast && mEast > iWest && mSouth > iNorth && mNorth < iSouth) {
    				console.log(i, "right");
    				col[1] = true;
    			}
    			if (mNorth - 20 < iSouth && mSouth > iNorth && mEast > iWest && mWest < iEast) {
    				console.log(i, "bottom");
    				col[2] = true;
    			}
    			if (mEast + 10 > iWest && mWest < iEast && mSouth > iNorth && mNorth < iSouth) {
    				console.log(i, "left");
    				col[3] = true;
    			}
    			break;
    		}
    		default: break;
    	}
    }

    postMessage(col);
}