# Acquiring Evidence

### Validating Forensic Tools

* NIST's Computer Forensic Reference Data Set
  * [https://www.nist.gov/programs-projects/computer-forensic-reference-data-sets](https://www.nist.gov/programs-projects/computer-forensic-reference-data-sets)

### Forensic Analysis Tools

Below are tools use for forensics analysis

* X-Ways
* Autopsy
* WinFE
  * Used from a Live-USB for Windows
* RegRipper
  * Used to extract data from the registry

### Creating Sterile Media

Creating sterile media is a necessary to ensure there isn't cross contamination, and to secure your forensic environment.

* You can write all 00's to a disk using Disk Manager in PALADIN VM

### Creating a forensic image

* DCFLDD (DD)
  * Can create a flat-file/RAW image
* EnCase
  * Stores files in the Expert WItness Format (EWF) or EnCase img file
* FTK Imager
  * Create an forensic image
  * Supports creating a hash before and after imaging

The best way is to create a DD file then convert it to e01 with high compression to reduce size
