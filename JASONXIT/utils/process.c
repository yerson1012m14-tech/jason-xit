//
//  process.c
//  JASONXIT Process Utilities
//

#include "process.h"
#include <stdio.h>

int disable_aslr(pid_t pid) {
    uint64_t proc = proc_find(pid);
    if (!proc) return -1;
    
    uint32_t p_flag = kread32(proc + off_proc_p_flag);
    kwrite32(proc + off_proc_p_flag, p_flag | P_DISABLE_ASLR);
    return 0;
}

int enable_aslr(pid_t pid) {
    uint64_t proc = proc_find(pid);
    if (!proc) return -1;
    
    uint32_t p_flag = kread32(proc + off_proc_p_flag);
    kwrite32(proc + off_proc_p_flag, p_flag & ~P_DISABLE_ASLR);
    return 0;
}
