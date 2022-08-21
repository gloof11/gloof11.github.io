# File Systems

## FAT

* System Area: This stores the volume boot record and FAT tables.
* Data Area: This stores the root directory and files

![FAT Areas](<../.gitbook/assets/image (4).png>)

### System Area

In the system area, we have the Volume Boot Record (VBR). We can find it in logical sector 0 (LS 0), which is the first sector within the partition boundaries. The boot process creates the VBR when the partition is formatted and contains information about the volume and boot code to continue the boot process for the operating system. If it is a primary partition, the VBR will consist of several sectors, typically, sectors 0, 1, and 2 with a backup in sectors 6, 7, and 8. The VBR and backups are stored in a "reserve area," which is typically 32 sectors before the first file allocation table begins.

#### File Allocation Table

The purpose of the file allocation table is to track the clusters and to track which files occupy which clusters. Each cluster is represented within the file allocation table starting with cluster 0. The file allocation table uses 4 bytes (32 bits) per cluster entry. The file allocation table will use the following entries to represent the cluster's current status:

• Unallocated: x0000 0000&#x20;

• Allocated: The next cluster that is used by the file (for example, it represents cluster 7 as x7000 0000)&#x20;

• Allocated: The last cluster that is used by the file (xFFFF FFF8)&#x20;

• Bad cluster: Not available for use (xFFFF FFF7)

We now have two files, with file number 1 occupying clusters 4 and 6. We can see that Cluster 4 is pointing to the next cluster containing the file data, which is Cluster 6. This is an example of **file fragmentation**. File number 2 is wholly contained within the cluster boundaries of Cluster 5. Cluster 5 will not point to a subsequent cluster; instead, it has the EOF hexadecimal value:

![Fragmented File](<../.gitbook/assets/image (1).png>)

### Data Area

The root directory is housed in the data area because, when it was stored in the system area, it was unable to grow enough to work with larger capacity devices. The critical component of the root directory is the directory entry. If there is a file, directory, or subdirectory, then there will be a corresponding directory entry. Each directory entry is 32 bytes in length and helps to track the name of the file, starting cluster, and file size in bytes.
