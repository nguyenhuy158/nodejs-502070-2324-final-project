const changeMode = (isChecked) => {
    console.log("=>(darkMode.js:9) changeMode");
    const htmlTag = $("html");
    if (isChecked) {
        htmlTag.attr("data-bs-theme", "dark");
    } else {
        htmlTag.attr("data-bs-theme", "light");
    }
};

$(document)
    .ready(function () {
        const isDarkMode = $("#darkModeSwitch")
            .prop("checked");
        console.log("=>(darkMode.js:14) isDarkMode", isDarkMode);
        changeMode(isDarkMode);
        
        $("#darkModeSwitch")
            .change(function () {
                changeMode(this.checked);
                
                const darkMode = $("#darkModeSwitch")
                    .is(":checked");
                $.ajax({
                           url    : `/users/update-settings`,
                           method : "POST",
                           data   : { darkMode: darkMode },
                           success: function (data) {
                               console.log("Settings updated:", data);
                           },
                           error  : function (error) {
                               console.error("Error updating settings:", error);
                           }
                       });
            });
    });

