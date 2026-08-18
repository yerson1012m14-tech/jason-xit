//
//  patchfinder.h
//  JASONXIT Kernel Patchfinder
//

#ifndef PATCHFINDER_H
#define PATCHFINDER_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __OBJC__
#import <Foundation/Foundation.h>
#endif

#import "xpf.h"

#ifdef __cplusplus
extern "C" {
#endif

int init_patchfinder(uint64_t kbase);
uint64_t find_allproc_offset(void);
uint64_t find_kernproc_offset(void);
uint64_t find_symbol_address(const char *name);

#ifdef __cplusplus
}
#endif

#endif /* PATCHFINDER_H */
