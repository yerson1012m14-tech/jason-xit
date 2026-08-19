//
//  JASONXITCore.h
//  JASONXIT
//  Entorno Nativo Apple: Objective-C Subsystem
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <mach/mach.h>
#import <mach/mach_host.h>
#import <sys/utsname.h>
#import <sys/sysctl.h>
#import "JASONXITFilzaBridge.h"

NS_ASSUME_NONNULL_BEGIN

@interface JASONXITSystemInfo : NSObject
@property (nonatomic, copy) NSString *deviceName;
@property (nonatomic, copy) NSString *systemVersion;
@property (nonatomic, copy) NSString *hardwareModel;
@property (nonatomic, assign) pid_t processId;
@property (nonatomic, assign) uint64_t memoryUsedBytes;
@property (nonatomic, assign) uint64_t memoryTotalBytes;
@property (nonatomic, copy) NSString *systemUptime;
@property (nonatomic, assign) NSInteger cpuCores;
@end

@interface JASONXITCore : NSObject

+ (instancetype)shared;

- (JASONXITSystemInfo *)fetchSystemInfo;
- (void)triggerHapticFeedback:(NSString *)style;
- (NSArray<NSDictionary *> *)listDirectoryContents:(NSString *)path;
- (BOOL)createFileAtPath:(NSString *)path content:(NSData *)content error:(NSError **)error;
- (BOOL)deleteItemAtPath:(NSString *)path error:(NSError **)error;
- (JASONXITFilzaBridge *)filzaBridge;
- (void)prepareFilzaFilesystem;
- (NSString *)filzaVirtualRoot;
- (NSString *)filzaArchivePath;
- (nullable NSString *)resolveAppDataContainer:(NSString *)bundleIdentifier error:(NSString * _Nullable * _Nullable)error;
- (BOOL)filzaPathHasActiveLease:(NSString *)path;

@end

NS_ASSUME_NONNULL_END
