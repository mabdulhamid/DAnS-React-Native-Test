import React, { useState, useEffect } from "react";
import RenderHtml from "react-native-render-html";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  useWindowDimensions,
} from "react-native";
import axios from "axios";

const JobDetailScreen = ({ route }) => {
  const { width } = useWindowDimensions();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const source = {
    html: `
        ${job?.description}
    `,
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://dev3.dansmultipro.co.id/api/recruitment/positions/${route.params.jobId}`
        );
        setJob(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchJob();
  }, []);

  const contentWidth = 0.2 * width;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : (
        <>
          <ScrollView>
            <View style={styles.bottom}>
              <Text style={styles.title}>Company</Text>
              <View style={styles.companyContainer}>
                <Image
                  source={{ uri: job.company_logo }}
                  style={styles.image}
                />
                <View style={styles.center}>
                  <Text style={styles.company}>{job.company}</Text>
                  <Text style={styles.location}>{job.location}</Text>
                  <Text style={styles.description}>{job.company_url}</Text>
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.title}>Job Specification</Text>
              <View style={styles.jobContainer}>
                <View>
                  <Text>Title</Text>
                  <Text style={styles.job}>{job.title}</Text>
                </View>

                <View>
                  <Text>Fulltime</Text>
                  <Text style={styles.job}>
                    {job.type == "Full Time" ? "Yes" : "No"}
                  </Text>
                </View>

                <View>
                  <Text>Description</Text>
                  <Text style={styles.job}>
                    {source ? (
                      <View style={styles.htmlContainer}>
                        <RenderHtml
                          contentWidth={contentWidth}
                          source={source}
                          tagsStyles={{
                            body: {
                              fontSize: 12,
                              whiteSpace: "normal",
                              textAlign: "justify",
                            },
                          }}
                        />
                      </View>
                    ) : (
                      <Text>-</Text>
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  htmlContainer: {
    width: "30%", // adjust this value as needed
    alignSelf: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  center: {
    justifyContent: "center",
  },
  bottom: {
    marginBottom: 20,
  },
  companyContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  jobContainer: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  company: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  job: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#0000FF",
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
});

export default JobDetailScreen;
