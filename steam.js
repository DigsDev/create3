// JQuery Functions are Valid

var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http){

//GLOBALS
var key = "5E7D86A4D8230D3782ACBB10578300C1";
var userID = "";

$(document).ready(function() {
    $("#userResults").hide();
    $("#friendResults").hide();
    $("#progress").hide();
    
    $("#userButton").click(function(e) {

        getSteamID($("#userField").val());

        /*
        getFriends now occurs in the getSteamID function after the ajax call, and I haven't added the displayUser function back anywhere yet
        */

        e.preventDefault();
    });
    $("#robin").click(function(e) {
        $("#userField").val("https://steamcommunity.com/id/robinwalker/");
        getSteamID("https://steamcommunity.com/id/robinwalker/");
        e.preventDefault();
    });
    $("#ronSwanson").click(function(e) {
        $("#userField").val("https://steamcommunity.com/id/jguzikowski/");
        getSteamID("https://steamcommunity.com/id/jguzikowski/");
        e.preventDefault();
    });
    $("#st4ck").click(function(e) {
        $("#userField").val("https://steamcommunity.com/id/St4ck/");
        getSteamID("https://steamcommunity.com/id/St4ck/");
        e.preventDefault();
    });
});


function getFriends(id) {
    
     $("#progress").show();
     $(".progress-bar").html("");

    var url = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" + key;
    url += "&steamid=" + id + "&relationship=friend";

    console.log(id);
    console.log(url);

    var friendsFriends = [];
    var friends = [];
    var privateFriends = [];
    var friendObjectList = [];
    console.log(friendObjectList);
    
    $(".progress-bar").animate({width: "10%"}, 1000);

    $.ajax({
        url: url,
        dataType: "json"
    }).done(function(parsed_json) {
        var data = parsed_json['friendslist']['friends'];

        $.each(data, function(i, friend) {
            friends.push(friend);
        });
    }).then(function() {
        
        $(".progress-bar").animate({width: "15%"}, 200);
        
        //testing\/
        var url3 = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + key + "&steamids=";
        var friendPlusUser = friends;
        friendPlusUser.push({steamid: id});
        var numCalls = friendPlusUser.length / 100;
        numCalls = Math.ceil(numCalls);
        var curCall = 0;
        var leftOverFriends = friendPlusUser.length - ((numCalls - 1) * 100);
        
        while (curCall < numCalls) {
            //if there are more than 100 more friends left, then add the next 100. Else add the remaining friends
            if (curCall != numCalls - 1) {
                var i = 0 + (100 * curCall);
                var urlCurCall = url3;
                for (i; i < 100 + (100 * curCall); i++) {
                    urlCurCall += friendPlusUser[i]['steamid'] + ",";
                }
                $.ajax({
                    url: urlCurCall,
                    dataType: "json"
                }).then(function(parsed_json3) {
                    for (var k = 0; k < 100; k++) {
                        //making a friend object where [0] is steamid, [1] is personaname, and [2] is avatar url
                        var friendObject = [parsed_json3['response']['players'][k]['steamid'],
                        parsed_json3['response']['players'][k]['personaname'],
                        parsed_json3['response']['players'][k]['avatar']];
                        //adding new friend object to the list
                        friendObjectList.push(friendObject);
                    }
                });
            }
            else {
                var j = (100 * curCall);
                var urlLastCall = url3;
                for (j; j < (100 * curCall) + leftOverFriends; j++) {
                     urlLastCall += friends[j]['steamid'] + ",";
                 }
                 $.ajax({
                    url: urlLastCall,
                    dataType: "json"
                }).then(function(parsed_json3) {
                    for (var k = 0; k < leftOverFriends; k++) {
                        //making a friend object where [0] is steamid, [1] is personaname, and [2] is avatar url
                        var friendObject = [parsed_json3['response']['players'][k]['steamid'],
                        parsed_json3['response']['players'][k]['personaname'],
                        parsed_json3['response']['players'][k]['avatar']];
                        //adding new friend object to the list
                        friendObjectList.push(friendObject);
                    }
                });
            }
             
            curCall += 1;
        }
        var atTimeList = friendObjectList;
        console.log("Fake: ");
        console.log(atTimeList);
        console.log(friendObjectList);
        //testing^^
        
        $(".progress-bar").animate({width: "30%"}, 700);
        
        $.each(friends, function(i, friendArray) {
            
            var friendID = friendArray['steamid'];
            var url2 = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" + key;
            url2 += "&steamid=" + friendID + "&relationship=friend";

            $.ajax({
                url: url2,
                dataType: "json"
            }).then(function(parsed_json2) {
                friendsFriends[friendID] = parsed_json2['friendslist']['friends'];
//___________________________________________________________________________________________________________________________________
                if (i == friends.length - 1) {
                    var everything = "";
                    
                    $(".progress-bar").animate({width: "70%"}, 800);
                    
                    $.each(friends, function(i, friend) {
                        friendID = friend['steamid'];
                        
                        everything += '<div class="friend shadow mb-2">'
                        + '<div class="row align-items-center justify-content-center">'
                        + '<div class="col-sm-2 text-center" id="avatar">img' + friendID + '</div>'
                        + '<div class="col-sm-auto">';

                        everything += '<a href="https://steamcommunity.com/profiles/' + friendID + '" class="d-flex" target="_blank">name';
                        everything += friendID + '</a></div>';
                        everything += '<div class="col-sm-auto"><span class="badge badge-light">';

                        if (privateFriends.indexOf(friendID) >= 0) {
                            everything += "Private";
                        }
                        else {
                            var commonFriends = 0;
                            $.each(friends, function(i, friend) {
                                var friendCompID = friend['steamid'];

                                $.each(friendsFriends[friendID], function(k, friend2) {
                                    var friend2CompID = friend2['steamid'];

                                    if (friend2CompID == friendCompID) {
                                        commonFriends++;
                                        return false; //break
                                    }
                                });
                            });

                            if (commonFriends > 0) {
                                everything += commonFriends + " Common Friends";
                            }
                            else {
                                everything += "No Common Friends";
                            }
                        }

                        everything += "</span></div></div></div>";
                    });
                    
                    $(".progress-bar").animate({width: "85%"}, 500);
                    
                    for (var z = friendObjectList.length - 1; z >= 0; z--) {
                        if (friendObjectList[z][0] == id) {
                            var userIndex = z;
                            console.log(userIndex);
                        }
                        everything = everything.replace(">img" + friendObjectList[z][0],'><img class="rounded" alt="avatar" src="' + friendObjectList[z][2] + '">');
                        everything = everything.replace(">name" + friendObjectList[z][0], '>' + friendObjectList[z][1]);
                        
                    }
                    
                    // Add current User Info
                    var userInfo = '<div class="friend shadow"><div class="row align-items-center justify-content-center"><div class="col-sm-2 text-center"><img class="rounded" alt="avatar" src="' + friendObjectList[userIndex][2]
                    + '"></div><div class="col-sm-auto"><a href="https://steamcommunity.com/profiles/76561197987041754" class="d-flex" target="_blank">' + friendObjectList[userIndex][1]
                    + " (Steam ID: " + friendObjectList[userIndex][0] + ')</a></div>'
                    + '<div class="col-sm-auto"><span class="badge badge-light">' + friends.length + ' Friends</span></div></div></div>';
                    
                    // Sort by number of friends in common
                    $(".progress-bar").animate({width: "92%"}, 700);
                    var unsortedList = [];
                    unsortedList = everything.split('<div class="friend shadow mb-2">');
                    unsortedList[unsortedList.length - 1] = unsortedList[unsortedList.length - 1].slice(0,-5);
                    
                    for (var x = unsortedList.length - 1; x > 0; x--) {
                        unsortedList[x] = '<div class="friend shadow mb-2">' + unsortedList[x];
                    }
                    console.log(unsortedList);
                    
                    var numInCommonList = [];
                    for (var q = 1; q < unsortedList.length; q++) {
                        if (unsortedList[q].includes('<span class="badge badge-light">No Common Friends</span>')) {
                            numInCommonList[q] = 0;
                        }
                        else if (unsortedList[q].includes('<span class="badge badge-light">Private</span>')) {
                            numInCommonList[q] = -1;
                        }
                        else {
                        var firstIndex = unsortedList[q].indexOf('<span class="badge badge-light">');
                        var secondIndex = unsortedList[q].indexOf(' Common Friends</span>');
                        var stringNumber = unsortedList[q].slice(firstIndex + 32, secondIndex);
                        var intNumber = parseInt(stringNumber, 10);
                        numInCommonList[q] = intNumber;
                        }
                    }
                    var combinedList = [];
                    for (var u = 1; u < unsortedList.length; u++) {
                        var bothValues = [unsortedList[u], numInCommonList[u]];
                        combinedList.push(bothValues);
                    }
                    //console.log(combinedList);
                    combinedList.sort(function(a,b) {
                        return a[1]-b[1];
                    });
                    combinedList.reverse();
                    console.log("sorted: " + combinedList);
                    
                    
                    var copyOfCombinedList =[];
                    
                    var everythingSorted = "";
                    for (var w = 1; w < combinedList.length; w++) {
                        copyOfCombinedList.push(combinedList[w][0].replace(/badge-light"/g, 'badge-light" onclick="showFriends()" style="cursor: pointer;"'));
                        combinedList[w][0] = copyOfCombinedList[w-1];
                        everythingSorted += combinedList[w][0];
                    }
                    $(".progress-bar").animate({width: "100%"}, 200);
                    //console.log(everythingSorted);
                    $(".progress-bar").html("Complete!");
                    $("#friendList").html(everythingSorted);
                    $("#displayUser").html(userInfo);
                    $("#userResults").show();
                    $("#friendResults").show();
                    console.log("Operation complete.");
                }
            }, function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
                privateFriends.push(friendID);
                friendsFriends[friendID] = ["private"];

//___________________________________________________________________________________________________________________________________

                if (i == friends.length - 1) {
                    var everything = "";
                    
                    $(".progress-bar").animate({width: "70%"}, 800);
                    
                    $.each(friends, function(i, friend) {
                        friendID = friend['steamid'];
                        
                        everything += '<div class="friend shadow mb-2">'
                        + '<div class="row align-items-center justify-content-center">'
                        + '<div class="col-sm-2 text-center" id="avatar">img' + friendID + '</div>'
                        + '<div class="col-sm-auto">';

                        everything += '<a href="https://steamcommunity.com/profiles/' + friendID + '" class="d-flex" target="_blank">name';
                        everything += friendID + '</a></div>';
                        everything += '<div class="col-sm-auto"><span class="badge badge-light">';

                        if (privateFriends.indexOf(friendID) >= 0) {
                            everything += "Private";
                        }
                        else {
                            var commonFriends = 0;
                            $.each(friends, function(i, friend) {
                                var friendCompID = friend['steamid'];

                                $.each(friendsFriends[friendID], function(k, friend2) {
                                    var friend2CompID = friend2['steamid'];

                                    if (friend2CompID == friendCompID) {
                                        commonFriends++;
                                        return false; //break
                                    }
                                });
                            });

                            if (commonFriends > 0) {
                                everything += commonFriends + " Common Friends";
                            }
                            else {
                                everything += "No Common Friends";
                            }
                        }

                        everything += "</span></div></div></div>";
                    });
                    
                    $(".progress-bar").animate({width: "85%"}, 500);
                    
                    for (var z = friendObjectList.length - 1; z >= 0; z--) {
                        if (friendObjectList[z][0] == id) {
                            var userIndex = z;
                            console.log(userIndex);
                        }
                        everything = everything.replace(">img" + friendObjectList[z][0],'><img class="rounded" alt="avatar" src="' + friendObjectList[z][2] + '">');
                        everything = everything.replace(">name" + friendObjectList[z][0], '>' + friendObjectList[z][1]);
                        
                    }
                    
                    // Add current User Info
                    var userInfo = '<div class="friend shadow"><div class="row align-items-center justify-content-center"><div class="col-sm-2 text-center"><img class="rounded" alt="avatar" src="' + friendObjectList[userIndex][2]
                    + '"></div><div class="col-sm-auto"><a href="https://steamcommunity.com/profiles/76561197987041754" class="d-flex" target="_blank">' + friendObjectList[userIndex][1]
                    + " (Steam ID: " + friendObjectList[userIndex][0] + ')</a></div>'
                    + '<div class="col-sm-auto"><span class="badge badge-light">' + friends.length + ' Friends</span></div></div></div>';
                    
                    // Sort by number of friends in common
                    $(".progress-bar").animate({width: "92%"}, 700);
                    var unsortedList = [];
                    unsortedList = everything.split('<div class="friend shadow mb-2">');
                    unsortedList[unsortedList.length - 1] = unsortedList[unsortedList.length - 1].slice(0,-5);
                    
                    for (var x = unsortedList.length - 1; x > 0; x--) {
                        unsortedList[x] = '<div class="friend shadow mb-2">' + unsortedList[x];
                    }
                    console.log(unsortedList);
                    
                    var numInCommonList = [];
                    for (var q = 1; q < unsortedList.length; q++) {
                        if (unsortedList[q].includes('<span class="badge badge-light">No Common Friends</span>')) {
                            numInCommonList[q] = 0;
                        }
                        else if (unsortedList[q].includes('<span class="badge badge-light">Private</span>')) {
                            numInCommonList[q] = -1;
                        }
                        else {
                        var firstIndex = unsortedList[q].indexOf('<span class="badge badge-light">');
                        var secondIndex = unsortedList[q].indexOf(' Common Friends</span>');
                        var stringNumber = unsortedList[q].slice(firstIndex + 32, secondIndex);
                        var intNumber = parseInt(stringNumber, 10);
                        numInCommonList[q] = intNumber;
                        }
                    }
                    var combinedList = [];
                    for (var u = 1; u < unsortedList.length; u++) {
                        var bothValues = [unsortedList[u], numInCommonList[u]];
                        combinedList.push(bothValues);
                    }
                    //console.log(combinedList);
                    combinedList.sort(function(a,b) {
                        return a[1]-b[1];
                    });
                    combinedList.reverse();
                    
                    
                    
                    console.log("sorted: " + combinedList);
                    
                    
                     var copyOfCombinedList =[];
                    
                    var everythingSorted = "";
                    for (var w = 1; w < combinedList.length; w++) {
                        copyOfCombinedList.push(combinedList[w][0].replace(/badge-light"/g, 'badge-light" onclick="showFriends()" style="cursor: pointer;"'));
                        combinedList[w][0] = copyOfCombinedList[w-1];
                        everythingSorted += combinedList[w][0];
                    }
                    $(".progress-bar").animate({width: "100%"}, 200);
                    //console.log(everythingSorted);
                    $(".progress-bar").html("Complete!");
                    $("#friendList").html(everythingSorted);
                    $("#displayUser").html(userInfo);
                    $("#userResults").show();
                    $("#friendResults").show();
                    console.log("Operation complete.");
                }
            });
        });
    });

} // end getFriends(id)





// Returns number of friends that list1 and list2 have in common.
function compareFriendLists(friendList1, friendList2) {
    var count = 0;

    var numFriends1 = friendList1.length;
    var numFriends2 = friendList2.length;

    // If either set has cardinality zero, there can't be any friends in common.
    if (numFriends1 == 0 || numFriends2 == 0) {
        return 0;
    }

    // Compare the smaller of the two against the larger
    if (numFriends1 <= numFriends2) {
        $.each(friendList1, function(i, friend) {
            var friendID = friend['steamid'];

            $.each(friendList2, function(k, friend2) {
                var friend2ID = friend2['steamid'];

                if (friend2ID == friendID) {
                    count++;
                    return false; //break
                }
                else if (friend2ID < friendID) {
                    return false; //break
                }
            });
        });
    }
    else {
        $.each(friendList2, function(i, friend) {
            var friendID = friend['steamid'];

            $.each(friendList1, function(k, friend2) {
                var friend2ID = friend2['steamid'];

                if (friend2ID == friendID) {
                    count++;
                }
                /*else if (friend2ID < friendID) {
                    return count; //break
                }*/
            });
        });
    }

    return count;
} // end compareFriendLists(friendList1, friendList2)


function getSteamID(inputUrl) {
    console.log(inputUrl);

    if (inputUrl.includes("https://steamcommunity.com/id/") == true) {
        console.log("Is a custom url");
        var myurl = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + key + "&vanityurl=";
        var vanityUrl = inputUrl.slice(30, inputUrl.length - 1);
        console.log(vanityUrl);
        myurl += vanityUrl;
        console.log("myurl: " + myurl);
        
        $http.get(myurl).then(function(parsed_json) {
                console.log(parsed_json);
                
                if (parsed_json['data']["response"]["success"] != 1) {
                    alert("Please enter a valid Unique Steam URL");
                }
                else {
                    userID = parsed_json['data']["response"]["steamid"];

                    console.log("steamid: " + userID);
                    getFriends(userID);
                }
                
            });
        
        /*
        $.ajax({
            url: myurl,
            dataType: "json",
            async: false,
            success: function(parsed_json) {
                console.log("parsed_json: " + parsed_json);

                if (parsed_json["response"]["success"] != 1) {
                    alert("Please enter a valid Unique Steam URL");
                }
                else {
                    userID = parsed_json["response"]["steamid"];

                    console.log("steamid: " + userID);
                }
            }
        }).done().then(getFriends(userID));*/
    }
    else if (inputUrl.includes("https://steamcommunity.com/profiles/") == true) {
        userID = inputUrl.slice(36, inputUrl.length);
        var myurl = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + key + "&steamids=";
        myurl += userID;

        $.ajax({
            url: myurl,
            dataType: "json",
            async: false,
            success: function(parsed_json) {
                console.log("parsed_json: " + parsed_json);
                var emptyString = [""];
                if (parsed_json["response"]["players"].length == 0) {
                    alert("Please enter a valid Unique Steam URL");
                }
                else {
                    console.log("Valid non-custom url");
                    console.log("steamid: " + userID);
                }
            }
        }).done().then(getFriends(userID));
    }
    else {
        alert("Please enter a valid Unique Steam URL");
    }
}
});