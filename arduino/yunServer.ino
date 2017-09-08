/*
  Spacebrew String
 
 Demonstrates how to create a sketch that sends and receives strings
 to and from Spacebrew. Every time string data is received it 
 is output to the Serial monitor.

 Make sure that your Yun is connected to the internet for this example 
 to function properly.
 
 The circuit:
 - No circuit required
 
 created 2013
 by Julio Terra
 
 This example code is in the public domain.
 
 More information about Spacebrew is available at: 
 http://spacebrew.cc/
 
 */

#include <Bridge.h>
#include <SpacebrewYun.h>

//////////////// CONSTANTS ////////////////

// Half-bridge enable pins                               
const int EN1 = 9;
const int EN2 = 6;  

// Motor 1 control pins
const int MC1 = A5;   
const int MC2 = A4;    

// Motor 2 control pins
const int MC3 = A3;    
const int MC4 = A2;   

// distance sensor pin
const int DS = 7;

// light sensors
const int time_interval = 500;  // in millis, between light sensor sends
const int light_interval = 20;  // minimum change in light reading that will be sent

// distance sensor
const int inner_distance_threshold = 7;
const int outer_distance_threshold = 11;

//////////////// GLOBAL VARS ///////////////

// create a variable of type SpacebrewYun and initialize it with the constructor
SpacebrewYun sb = SpacebrewYun("samee", "String sender and receiver");

void setup() { 

  // start the serial port
  Serial.begin(57600);

  // for debugging, wait until a serial console is connected
//  delay(4000);
//  while (!Serial) { ; }

  // start-up the bridge
  Bridge.begin();

  // configure the spacebrew object to print status messages to serial
  sb.verbose(true);

  // configure the spacebrew publisher and subscriber
  sb.addSubscribe("command-receive", "string");

  // register the string message handler method 
  sb.onStringMessage(handleCommand);

  // connect to cloud spacebrew server at "sandbox.spacebrew.cc"
  sb.connect("sandbox.spacebrew.cc"); 

  // initialize the motor
  pinMode(EN1, OUTPUT);
  pinMode(MC1, OUTPUT);
  pinMode(MC2, OUTPUT);
  left_brake();

  pinMode(EN2, OUTPUT);
  pinMode(MC3, OUTPUT);
  pinMode(MC4, OUTPUT);
  right_brake(); 
  
} 


void loop() { 
  // monitor spacebrew connection for new data
  sb.monitor();
} 

///////////// COMMAND HANDLER /////////////////

// handler method that is called whenever a new string message is received 
void handleCommand (String route, String command) {
  
  Serial.print(F("New command: "));
  Serial.println(command);
  
  // decode the command
  int left_dir = command.substring(0,1).toInt();
  int left_speed = command.substring(1,4).toInt();
  int right_dir = command.substring(4,5).toInt();
  int right_speed = command.substring(5,8).toInt();
  
  // set the left motor speed
  if (left_speed == 0) 
    left_brake();
  else {
    if (left_dir == 0) 
      left_reverse(left_speed);
    else 
      left_forward(left_speed);
  }
    
  // set the right motor speed
  if (right_speed == 0) 
    right_brake();
  else {
    if (right_dir == 0)
      right_reverse(right_speed);
    else 
      right_forward(right_speed);
  }
  
  Serial.println();   
}

///////////// MOTOR FUNCTIONS /////////////////

void left_forward(int rate)
{
  Serial.print(F("left forward: ")); Serial.println(rate);

  digitalWrite(EN1, LOW);
  digitalWrite(MC1, HIGH);
  digitalWrite(MC2, LOW);
  analogWrite(EN1, rate);
}

void right_forward(int rate)
{
  Serial.print(F("right forward: ")); Serial.println(rate);

  digitalWrite(EN2, LOW);
  digitalWrite(MC3, HIGH);
  digitalWrite(MC4, LOW);
  analogWrite(EN2, rate);
}

void left_reverse(int rate)
{
  Serial.print(F("left reverse: ")); Serial.println(rate);

  digitalWrite(EN1, LOW);
  digitalWrite(MC1, LOW);
  digitalWrite(MC2, HIGH);
  analogWrite(EN1, rate);
}

void right_reverse(int rate)
{
  Serial.print(F("right reverse: ")); Serial.println(rate);

  digitalWrite(EN2, LOW);
  digitalWrite(MC3, LOW);
  digitalWrite(MC4, HIGH);
  analogWrite(EN2, rate);
}

void left_brake()
{ 
  Serial.println(F("left brake"));
  
  digitalWrite(EN1, LOW);
  digitalWrite(MC1, LOW);
  digitalWrite(MC2, LOW);
  analogWrite(EN1, HIGH);
}

void right_brake()
{ 
  Serial.println(F("right brake"));

  digitalWrite(EN2, LOW);
  digitalWrite(MC3, LOW);
  digitalWrite(MC4, LOW);
  analogWrite(EN2, HIGH);
}

// handler method that is called whenever a new string message is received 
void handleString (String route, String value) {
  // print the message that was received
  Serial.print("From ");
  Serial.print(route);
  Serial.print(", received msg: ");
  Serial.println(value);
}
