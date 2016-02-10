[![Logo](http://sipcapture.org/data/images/sipcapture_header.png)](http://sipcapture.org)

## HOMER 5 SNMP Bridge

Modular component for [HOMER 5](http://github.com/sipcapture/homer) providnig SNMP access to API


![splitter](http://i.imgur.com/lytn4zn.png)

### Status

* Development Stage, testers welcome onboard

### Usage

* Install using ```npm```
* Configure API settings in ```config.js```
* Start the service using ```npm start```
* Test using ```snmpget -v 2c -c any localhost 1.3.6.1.4.1.37476.9000.25.1.0 ```

### OID 

Sipcapture uses its reserved OID Root **1.3.6.1.4.1.37476.9000.25**

| OID                            | Value           | Source  |
| ------------------------------ |:--------------- |:------- |
| 1.3.6.1.4.1.37476.9000.25      | OID ROOT        |         |
| 1.3.6.1.4.1.37476.9000.25.1.0  | Hostname        | OS      |
| 1.3.6.1.4.1.37476.9000.25.2.0  | Uptime          | OS      |
| 1.3.6.1.4.1.37476.9000.25.3.0  | Load Avg        | OS      |
| 1.3.6.1.4.1.37476.9000.25.4.0  | Free Memory     | OS      |
| 1.3.6.1.4.1.37476.9000.25.5.0  | Total Memory    | OS      |
|   |  |  |
|   |  |  |
| 1.3.6.1.4.1.37476.9000.25.10.0      | Stats  ROOT  | API   |
| 1.3.6.1.4.1.37476.9000.25.10.5.1.0  | Packet Count @5m   | API   |
| 1.3.6.1.4.1.37476.9000.25.10.5.2.0  | Packet Size @5m   | API   |
| 1.3.6.1.4.1.37476.9000.25.10.5.3.0  | ASR @5m   | API   |
| 1.3.6.1.4.1.37476.9000.25.10.5.4.0  | NER @5m   | API   |
| 1.3.6.1.4.1.37476.9000.25.10.15.1.0  | Packet Count @15m   | API   |
| 1.3.6.1.4.1.37476.9000.25.10.15.2.0  | Packet Size @15m   | API   |
| 1.3.6.1.4.1.37476.9000.25.10.15.3.0  | ASR @15m   | API   |
| 1.3.6.1.4.1.37476.9000.25.10.15.4.0  | NER @15m   | API   |
|   |  |  |
|   |  |  |
| 1.3.6.1.4.1.37476.9000.25.11.0      | Alarms  ROOT  | API   |
| 1.3.6.1.4.1.37476.9000.25.11.5.0      | Alarm Count @5m  | API   |
| 1.3.6.1.4.1.37476.9000.25.11.15.0      | Alarm Count @15m  | API   |
| 1.3.6.1.4.1.37476.9000.25.11.30.0      | Alarm Count @30m  | API   |
| 1.3.6.1.4.1.37476.9000.25.11.60.0      | Alarm Count @60m  | API   |

### Documentation

Project Documentation is available here:

https://github.com/sipcapture/homer/wiki

For Help contact: support@sipcapture.org



### Developers
Contributors and Contributions to our project are always welcome! If you intend to participate and help us improve HOMER by sending patches, we kindly ask you to sign a standard [CLA (Contributor License Agreement)](http://cla.qxip.net) which enables us to distribute your code alongside the project without restrictions present or future. It doesn’t require you to assign to us any copyright you have, the ownership of which remains in full with you. Developers can coordinate with the existing team via the [homer-dev](http://groups.google.com/group/homer-dev) mailing list. If you'd like to join our internal team and volounteer to help with the project's many needs, feel free to contact us anytime!




### License & Copyright

See LICENSE for License details

*(C) 2008-2016 QXIP BV*

.
