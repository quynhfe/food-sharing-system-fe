import React from "react";
import { View, Text } from "react-native";
import { getCategoryIcon, getCategoryColor } from "../utils/map.utils";

interface ClusterIconProps {
  clusterPosts: any[];
  isUserLoc: boolean;
}

export const ClusterIcon: React.FC<ClusterIconProps> = ({ clusterPosts, isUserLoc }) => {
  const renderContent = () => {
    if (clusterPosts.length === 1) {
      const post = clusterPosts[0];
      return (
        <View className={`${getCategoryColor(post.category)} p-2 rounded-full border-2 border-white shadow-sm`}>
          {getCategoryIcon(post.category)}
        </View>
      );
    }

    const firstCat = clusterPosts[0].category;
    const allSameCat = clusterPosts.every((p: any) => p.category === firstCat);

    if (allSameCat) {
       return (
         <View className="relative">
           <View className={`${getCategoryColor(firstCat)} p-2 rounded-full border-2 border-white shadow-sm`}>
             {getCategoryIcon(firstCat)}
           </View>
           <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center border border-white">
             <Text className="text-[10px] font-bold text-white">{clusterPosts.length > 9 ? '9+' : clusterPosts.length}</Text>
           </View>
         </View>
       );
    }

    const displayPosts = clusterPosts.slice(0, 4);
    return (
      <View className="relative" style={{ width: 44, height: 44 }}>
        {displayPosts.map((post, i) => (
          <View 
            key={post._id} 
            className={`absolute ${getCategoryColor(post.category)} p-1.5 rounded-full border-2 border-white shadow-sm`}
            style={{ 
               zIndex: 10 - i, 
               transform: [
                 { translateX: i * 4 }, 
                 { translateY: i * 4 },
                 { scale: 1 - i * 0.05 }
               ] 
            }}
          >
            {getCategoryIcon(post.category)}
          </View>
        ))}
        {clusterPosts.length > 1 && (
           <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center border border-white z-20">
             <Text className="text-[10px] font-bold text-white">{clusterPosts.length > 9 ? '9+' : clusterPosts.length}</Text>
           </View>
        )}
      </View>
    );
  };

  if (isUserLoc) {
    return (
      <View className="p-1 items-center justify-center rounded-full border-2 border-red-500 bg-red-500/10 shadow-md">
        {renderContent()}
      </View>
    );
  }

  return renderContent();
};
