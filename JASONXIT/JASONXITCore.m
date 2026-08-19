//
//  JASONXITCore.m
//  JASONXIT
//  Entorno Nativo Apple: Objective-C Subsystem
//

#import "JASONXITCore.h"

@implementation JASONXITSystemInfo
@end

@implementation JASONXITCore

+ (instancetype)shared {
    static JASONXITCore *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[JASONXITCore alloc] init];
    });
    return sharedInstance;
}

- (JASONXITSystemInfo *)fetchSystemInfo {
    JASONXITSystemInfo *info = [[JASONXITSystemInfo alloc] init];
    
    UIDevice *device = [UIDevice currentDevice];
    info.deviceName = device.name ?: @"Apple Device";
    info.systemVersion = [NSString stringWithFormat:@"iOS %@", device.systemVersion ?: @"15.0+"];
    
    struct utsname systemInfo;
    uname(&systemInfo);
    info.hardwareModel = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding] ?: @"iPhone/iPad";
    
    info.processId = getpid();
    
    struct mach_task_basic_info taskInfo;
    mach_msg_type_number_t count = MACH_TASK_BASIC_INFO_COUNT;
    if (task_info(mach_task_self(), MACH_TASK_BASIC_INFO, (task_info_t)&taskInfo, &count) == KERN_SUCCESS) {
        info.memoryUsedBytes = taskInfo.resident_size;
    } else {
        info.memoryUsedBytes = 0;
    }
    info.memoryTotalBytes = [NSProcessInfo processInfo].physicalMemory;
    info.cpuCores = [NSProcessInfo processInfo].activeProcessorCount;
    
    NSTimeInterval uptime = [NSProcessInfo processInfo].systemUptime;
    NSInteger hours = (NSInteger)(uptime / 3600);
    NSInteger mins = (NSInteger)(((NSInteger)uptime % 3600) / 60);
    info.systemUptime = [NSString stringWithFormat:@"%ldh %ldm", (long)hours, (long)mins];
    
    return info;
}

- (void)triggerHapticFeedback:(NSString *)style {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIImpactFeedbackStyle impactStyle = UIImpactFeedbackStyleMedium;
        if ([style isEqualToString:@"heavy"]) {
            impactStyle = UIImpactFeedbackStyleHeavy;
        } else if ([style isEqualToString:@"light"]) {
            impactStyle = UIImpactFeedbackStyleLight;
        } else if ([style isEqualToString:@"rigid"]) {
            impactStyle = UIImpactFeedbackStyleRigid;
        } else if ([style isEqualToString:@"soft"]) {
            impactStyle = UIImpactFeedbackStyleSoft;
        }
        
        UIImpactFeedbackGenerator *generator = [[UIImpactFeedbackGenerator alloc] initWithStyle:impactStyle];
        [generator prepare];
        [generator impactOccurred];
    });
}

- (NSArray<NSDictionary *> *)listDirectoryContents:(NSString *)path {
    NSMutableArray<NSDictionary *> *items = [NSMutableArray array];
    NSFileManager *fm = [NSFileManager defaultManager];
    
    NSError *err = nil;
    NSArray<NSString *> *contents = [fm contentsOfDirectoryAtPath:path error:&err];
    if (err || !contents) {
        return items;
    }
    
    for (NSString *name in contents) {
        NSString *fullPath = [path stringByAppendingPathComponent:name];
        NSDictionary *attrs = [fm attributesOfItemAtPath:fullPath error:nil];
        BOOL isDir = [attrs[NSFileType] isEqualToString:NSFileTypeDirectory];
        unsigned long long size = [attrs[NSFileSize] unsignedLongLongValue];
        NSDate *modDate = attrs[NSFileModificationDate];
        
        [items addObject:@{
            @"name": name,
            @"path": fullPath,
            @"isDirectory": @(isDir),
            @"size": @(size),
            @"modified": modDate ?: [NSDate date],
            @"extension": [name pathExtension] ?: @""
        }];
    }
    
    return [items copy];
}

- (BOOL)createFileAtPath:(NSString *)path content:(NSData *)content error:(NSError **)error {
    NSFileManager *fm = [NSFileManager defaultManager];
    NSString *parentDir = [path stringByDeletingLastPathComponent];
    if (![fm fileExistsAtPath:parentDir]) {
        [fm createDirectoryAtPath:parentDir withIntermediateDirectories:YES attributes:nil error:error];
    }
    return [fm createFileAtPath:path contents:content attributes:nil];
}

- (BOOL)deleteItemAtPath:(NSString *)path error:(NSError **)error {
    return [[NSFileManager defaultManager] removeItemAtPath:path error:error];
}

- (JASONXITFilzaBridge *)filzaBridge { return [JASONXITFilzaBridge shared]; }
- (void)prepareFilzaFilesystem { [[JASONXITFilzaBridge shared] prepareFilesystem]; }
- (NSString *)filzaVirtualRoot { return [[JASONXITFilzaBridge shared] virtualRoot]; }
- (NSString *)filzaArchivePath { return [[JASONXITFilzaBridge shared] archivePath]; }
- (NSString *)resolveAppDataContainer:(NSString *)bundleIdentifier error:(NSString **)error { return [[JASONXITFilzaBridge shared] dataContainerPathForIdentifier:bundleIdentifier error:error]; }
- (BOOL)filzaPathHasActiveLease:(NSString *)path { return [[JASONXITFilzaBridge shared] pathHasActiveLease:path]; }


@end
