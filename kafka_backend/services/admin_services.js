var Admin = require('./../models/admin')
var mysql = require('./../models/mysql');

exports.addAdmin = function(data, callback){
    var adminDetail = {
        username:data.admininfo.username,
        password:data.admininfo.password
        };
    Admin.addNewAdmin( adminDetail , function(err , results){
        if(err){
            console.log("[Kafka] Error adding new admin")
        }
        console.log("its result in admin services"+results);
        callback(err,results);
    });
}


exports.adminHotelAnalysis = function(data , callback){
  //Analysis#1
  var finalResult = [];
  var hotel_analysis_query1="select sum(booking_amount) as Booking_Amount,hotel_name from hotel_transaction where Year(booking_date) = '"+data.year+"' group by hotel_name order by Booking_Amount desc limit 10";
  var result1 = {};
  result1.hotels = [];
  result1.sales= [];

      mysql.fetchData(function(err,results) {

          if(err){
              console.log("error");
          }
          else{
            results.map((value)=>{
              result1.hotels.push(value.hotel_name);
              result1.sales.push(value.Booking_Amount);
            });
            console.log("result1 ******",result1);
            finalResult.push({top_ten_hotel_sales:result1});

            //Analysis#2
            var hotel_analysis_query2="select name_city,sum(booking_amount) as Booking_Amount from hotel_transaction group by name_city order by Booking_Amount";
            var result2 ={};
            result2.city_name =[];
            result2.sales=[];

            mysql.fetchData(function(err,results) {

                if(err){
                      console.log("error");
                  }
                  else{
                      console.log("Results from database:"+JSON.stringify(results));
                      results.map((value)=>{
                        result2.city_name.push(value.name_city);
                        result2.sales.push(value.Booking_Amount);
                      });

                      console.log("result2****",result2);
                      finalResult.push({top_ten_hotel_sales_city:result2});


                      //Analysis#3
                      var hotel_analysis_query3="select hotel_name,count(hotel_id) as Number_Of_Bookings,sum(booking_amount) as Booking_Amount from hotel_transaction where month(booking_date) = month(current_date())-1 group by hotel_name order by Number_Of_Bookings desc limit 10";

                      var result3 ={};
                      result3.hotels = [];
                      result3.sales=[];

                      mysql.fetchData(function(err,results) {
                          console.log("results:  ",results);

                            if(err){
                                console.log("error");
                                result3.message = "Error could not find top ten hotels"
                                //callback(null,err);
                                 }
                            console.log("Results from database:"+JSON.stringify(results));

                            results.map((value)=>{
                                result3.hotels.push(value.hotel_name);
                                result3.sales.push(value.Number_Of_Bookings);
                            });
                            console.log("result3****",result3);
                            finalResult.push({top_ten_host_sales:result3});
                            var result_1 = {status:201,finalResult : finalResult};

                            console.log("analysis result:",result_1);
                            callback(null, result_1);

                        }, hotel_analysis_query3);

                  }
              }, hotel_analysis_query2);


        }
    }, hotel_analysis_query1);

}

exports.adminSignIn = function(data, callback){
 console.log("adminSignIn:data",data);
   var adminDetail = {
       username:data.username,
       password:data.password
       };
   Admin.adminSignIn( adminDetail , function(err , results){
       if(err){
           console.log("[Kafka] Error in siging in admin")
       }
       console.log("its result in admin services signin"+results);
       callback(err,results);
   });
}

exports.adminHotelBilling= function(data,callback) {

   var hotelbilling="select booking_id,user_id,hotel_name,booking_date,booking_amount from hotel_transaction";
   mysql.fetchData(function(err,results) {

    if(err){
      console.log("error");
         }
    console.log("Results from database:"+JSON.stringify(results));
           callback(err,results);
  }, hotelbilling);
}

exports.adminCarBilling= function(data,callback) {
   mysql.fetchData(function(err,results) {

    if(err){
      console.log("[Kafka] Error adminCarBilling");
    }
    callback(err,results);
  }, data.query);
}

exports.adminflightBilling= function(data,callback) {
   mysql.fetchData(function(err,results) {

    if(err){
      console.log("[Kafka] Error adminflightBilling");
    }
    callback(err,results);
  }, data.query);
}

exports.adminCarAnalysis = function(data , callback){
  //Analysis#1
  var finalResult = [];
  var car_analysis_query1="select sum(booking_amount) as Booking_Amount,model_no from car_transaction where Year(booking_date) = '"+data.year+"' group by model_no order by Booking_Amount desc limit 10";
  var result1 = {};
  result1.models = [];
  result1.sales= [];

      mysql.fetchData(function(err,results) {

          if(err){
              console.log("error");
          }
          else{
            results.map((value)=>{
              result1.models.push(value.model_no);
              result1.sales.push(value.Booking_Amount);
            });
            console.log("result1 ******",result1);
            finalResult.push({top_ten_car_sales:result1});

            //Analysis#2
            var car_analysis_query2="select src_city,sum(booking_amount) as Booking_Amount from car_transaction group by src_city order by Booking_Amount";
            var result2 ={};
            result2.cities =[];
            result2.sales=[];

            mysql.fetchData(function(err,results) {

                if(err){
                      console.log("error");
                  }
                  else{
                      console.log("Results from database:"+JSON.stringify(results));
                      results.map((value)=>{
                        result2.cities.push(value.src_city);
                        result2.sales.push(value.Booking_Amount);
                      });

                      console.log("result2****",result2);
                      finalResult.push({top_ten_city_sales:result2});


                      //Analysis#3
                      var car_analysis_query3="select sum(booking_amount) as Booking_Amount,agency_name from car_transaction where month(booking_date) = month(current_date())-1 group by agency_name order by Booking_Amount desc limit 10";;

                      var result3 ={};
                      result3.agencies = [];
                      result3.sales=[];

                      mysql.fetchData(function(err,results) {
                          console.log("results:  ",results);

                            if(err){
                                console.log("error");
                                result3.message = "Error could not find top ten hotels"
                                //callback(null,err);
                                 }
                            console.log("Results from database:"+JSON.stringify(results));

                            results.map((value)=>{
                                result3.agencies.push(value.agency_name);
                                result3.sales.push(value.Number_Of_Bookings);
                            });
                            console.log("result3****",result3);
                            finalResult.push({top_ten_agency_sales:result3});
                            var result_1 = {status:201,finalResult : finalResult};

                            console.log("analysis result:",result_1);
                            callback(null, result_1);

                        }, car_analysis_query3);

                  }
              }, car_analysis_query2);


        }
    }, car_analysis_query1);

}

exports.adminFlightAnalysis = function(data , callback){
  //Analysis#1
  var finalResult = [];
  var flight_analysis_query1="select sum(booking_amount) as Booking_Amount,carrier_name from flight_transaction where Year(booking_date) = '"+data.year+"' group by carrier_name order by Booking_Amount desc limit 10";
  var result1 = {};
  result1.carriers = [];
  result1.sales= [];

      mysql.fetchData(function(err,results) {

          if(err){
              console.log("error");
          }
          else{
            results.map((value)=>{
              result1.carriers.push(value.carrier_name);
              result1.sales.push(value.Booking_Amount);
            });
            console.log("result1 ******",result1);
            finalResult.push({top_ten_carrier_sales:result1});

            //Analysis#2
            var flight_analysis_query2="select src_city,sum(booking_amount) as Booking_Amount from flight_transaction group by src_city order by Booking_Amount";
            var result2 ={};
            result2.cities =[];
            result2.sales=[];

            mysql.fetchData(function(err,results) {

                if(err){
                      console.log("error");
                  }
                  else{
                      console.log("Results from database:"+JSON.stringify(results));
                      results.map((value)=>{
                        result2.cities.push(value.src_city);
                        result2.sales.push(value.Booking_Amount);
                      });

                      console.log("result2****",result2);
                      finalResult.push({top_ten_city_sales:result2});


                      //Analysis#3
                      var flight_analysis_query3="select carrier_name,count(flight_id) as Number_Of_Bookings,sum(booking_amount) as Booking_Amount from flight_transaction where month(booking_date) = month(current_date())-1 group by carrier_name order by Number_Of_Bookings desc limit 10";

                      var result3 ={};
                      result3.carriers = [];
                      result3.bookings=[];

                      mysql.fetchData(function(err,results) {
                          console.log("results:  ",results);

                            if(err){
                                console.log("error");
                                result3.message = "Error could not find top ten hotels"
                                //callback(null,err);
                                 }
                            console.log("Results from database:"+JSON.stringify(results));

                            results.map((value)=>{
                                result3.carriers.push(value.carrier_name);
                                result3.bookings.push(value.Number_Of_Bookings);
                            });
                            console.log("result3****",result3);
                            finalResult.push({top_ten_carrier_bookings:result3});
                            var result_1 = {status:201,finalResult : finalResult};

                            console.log("analysis result:",result_1);
                            callback(null, result_1);

                        }, flight_analysis_query3);

                  }
              }, flight_analysis_query2);


        }
    }, flight_analysis_query1);

}
